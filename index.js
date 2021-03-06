const {
    Builder,
    By,
    Key,
    until
} = require('selenium-webdriver');
const fs = require('fs');
const async = require('async');

// read credentials from local file
var Users = JSON.parse(fs.readFileSync(process.env.CREDENTIALS_FILE || './credentials.json', "utf8"));

var tokens = [];

// create a queue object with concurrency 10
var q = async.queue(login, process.env.LIMIT_CONCURRENT || 10);

// assign a callback
q.drain = function () {
    console.log('All logins have been executed!');
};

// add some items to the queue (batch-wise)
q.push(Users, function (err) {
    console.log('finished processing item');
});

async function login(user, callback) {
    console.log('Running for user: ' + user.name);
    let driver = await
    new Builder().forBrowser(process.env.BROWSER || 'firefox').usingServer(process.env.SELENIUM_SERVER || 'http://localhost:4444/wd/hub').build();
    let actions = driver.actions({
        bridge: true
    });
    try {
        // Invoke login button from okeanos website and wait until GRNET's AAI page load 
        await driver.get('https://accounts.okeanos.grnet.gr/ui/login');
        await driver.findElement(By.xpath('/html/body/div[2]/div/div[3]/div/div[1]/div/div[1]/a'))
            .sendKeys('webdriver', Key.ENTER);
        await driver.wait(until.titleIs('AAI Federation for the Ministry of Education • Select your Home Organization'), 10000);

        // find organization selection dropdown, fill and select user's organization
        await driver.wait(until.elementLocated(By.className('select2-selection__placeholder')), 10000);

        var select = await driver.findElement(By.className('select2-selection select2-selection--single'));

        await actions.click(select).sendKeys(user.organization, Key.ENTER).perform();

        await driver.findElement(By.xpath('//*[@id="idp_selection"]/div[1]/div[2]/button'))
            .sendKeys('webdriver', Key.ENTER);
        await driver.wait(until.titleIs('Central Authentication Service'), 10000);

        // locate username and password fields in Organization's login page
        // *code below configured for aegean, maybe it will not Work for others
        await driver.wait(until.elementLocated(
            By.className('form-input')), 10000);

        await driver.findElement(By.xpath('//*[@id="username"]'))
            .sendKeys(user.username);
        await driver.findElement(By.xpath('//*[@id="password"]'))
            .sendKeys(user.password);


        await driver.findElement(By.xpath('//*[@id="submitForm"]'))
            .sendKeys('webdriver', Key.ENTER);

        // wait for okeanos dashboard to load
        try {
            await driver.wait(until.titleIs('~okeanos Dashboard | Overview'), 10000);
        } catch (e) {
            var confirm = await driver.wait(until.elementLocated(By.name('confirm')), 3000)
                .catch(() => {
                    console.log('Authentication for user ' + user.name + ' failed! :(');
                });
            await confirm.sendKeys('webdriver', Key.ENTER);
        }

        // retrieve user's token information
        await driver.get('https://accounts.okeanos.grnet.gr/ui/api_access');

        await driver.wait(until.elementLocated(By.name('auth_token')), 10000);

        var token = await driver.findElement(By.name('auth_token')).getAttribute('value');

        // retrieve Opestack API Username/password
        var api_username = await driver.findElement(By.xpath('(//span[@class=\'user-data\'])[1]')).getText();
        var api_password = await driver.findElement(By.xpath('(//span[@class=\'user-data\'])[2]')).getText();

        // pass properties to user's object
        user.token = token;
        user.api_username = api_username;
        user.api_password = api_password;

        await tokens.push(user);

        // write the updated users object with Token to the credentials.json file
        await fs.writeFile(
            process.env.CREDENTIALS_FILE || './credentials.json',
            JSON.stringify(tokens),

            function (err) {
                if (err) {
                    console.error('Crap happens');
                }
            }
        );
    } catch (e) {
        console.log('Xmmm something went really wrong? Internet connection? Okeanos ' +
            'portal not Working? Maybe something else then. :\\');
    } finally {
        await driver.quit();
        await callback();
    }
}