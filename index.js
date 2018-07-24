const {Builder, By, Key, until} = require('selenium-webdriver');
const fs = require('fs');

// read credentials from local file
var Users = JSON.parse(fs.readFileSync(process.env.CREDENTIALS_FILE || './credentials.json', "utf8"));

var tokens = [];

// loop through its user asynchronously
for (const user in Users) {
    (login)(user);
}

async function login(user) {
    console.log('Running for user: ' + Users[user].name);
    let driver = await
        new Builder().forBrowser(process.env.BROWSER || 'firefox').usingServer(process.env.SELENIUM_SERVER || 'http://localhost:4444/wd/hub').build();
    let actions = driver.actions({bridge: true});
    try {
        // Invoke login button from okeanos website and wait until GRNET's AAI page load 
        await driver.get('https://accounts.okeanos.grnet.gr/ui/login');
        await  driver.findElement(By.xpath('/html/body/div[2]/div/div[3]/div/div[1]/div/div[1]/a'))
            .sendKeys('webdriver', Key.ENTER);
        await  driver.wait(until.titleIs('AAI Federation for the Ministry of Education • Select your Home Organization'), 10000);

        // find organization selection dropdown, fill and select user's organization
        await driver.wait(until.elementLocated(By.className('select2-selection__placeholder')), 10000);

        var select = await driver.findElement(By.className('select2-selection select2-selection--single'));

        await actions.click(select).sendKeys(Users[user].organization, Key.ENTER).perform();

        await  driver.findElement(By.xpath('//*[@id="idp_selection"]/div[1]/div[2]/button'))
            .sendKeys('webdriver', Key.ENTER);
        await  driver.wait(until.titleIs('Central Authentication Service'), 10000);

        // locate username and password fields in Organization's login page
        // *code below configured for aegean, maybe it will not Work for others
        await driver.wait(until.elementLocated(
            By.className('form-input')), 10000);

        await driver.findElement(By.xpath('//*[@id="username"]'))
            .sendKeys(Users[user].username);
        await driver.findElement(By.xpath('//*[@id="password"]'))
            .sendKeys(Users[user].password);


        await driver.findElement(By.xpath('//*[@id="submitForm"]'))
            .sendKeys('webdriver', Key.ENTER);
        // wait for okeanos dashboard to load
        await driver.wait(until.titleIs('~okeanos Dashboard | Overview'), 10000)
            .catch(() => {
                console.log('Authentication for user ' + Users[user].name + ' failed! :(');
            });

        // retrieve user's token information
        await driver.get('https://accounts.okeanos.grnet.gr/ui/api_access');

        await driver.wait(until.elementLocated(By.name('auth_token')), 10000);
 
        var token = await driver.findElement(By.name('auth_token')).getAttribute('value');

        // pass a token property to user object
        Users[user].token = token;
        await tokens.push(Users[user]);

        // write the updated users object with Token to the tokens.json file
        await fs.writeFile(
            process.env.TOKENS_FILE || './tokens.json',
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
    }

}