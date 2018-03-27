# Automate bot for GRNET's Okeanos
This is an automated bot using selenium to authenticate your account/accounts to Okeanos GRNET and retrieve some use info. The tool takes as input and array with your account/accounts. It generate a file with your account/s API Token keys, so you can use them later if you want.  

# How to use
IN order to use this tool you need to download a selenium driver. There are two ways in which you can use this tool. You can either run selenium with your browser locally or run it remotely.

1. The first way is to simply run selenium locally. The driver you'll download depends from the browser you want to use and your operating system. To download the latest Selenium Webdriver go [here](https://www.seleniumhq.org/download/#selenium_ide).

2. This is the way i prefer most using containers. You can go to official [Selenium DockerHub](https://hub.docker.com/u/selenium/) and look for a container with the browser you prefer most . After you choose your container just run it in whatsoever docker enviroment you have and voila. The image i use is a setup with firefox. You can just run this container
``` docker run -p 4444:4444 -p 5900:5900  selenium/standalone-firefox-debug:2.53.1 ```
There are two exposed ports, the one you need to connect to is 4444 the other (5000) is for a VNC connection.

To run script you need to download some npm dependencies with
```npm i``` 
and then run script with 
```npm start```

### After that See the Magic Happens!
![sample](https://user-images.githubusercontent.com/4427553/37987632-5fa08a52-3207-11e8-96bb-fc1c3eb81387.gif)
