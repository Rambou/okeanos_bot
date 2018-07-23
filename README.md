# Automate bot for GRNET's Okeanos
This is an automated bot using selenium to authenticate your account/s to Okeanos GRNET and retrieve some of the user's information. The tool takes as input an array of your account/s. It generates a file with your account/s API Token keys, so you can use them later if you want.  
_**Note**: this script will currently work for users from university of the aegean. If you are from another department it will need a little bit of modification. (I promise it will be few lines of code :D )_

# How to use
IN order to use this tool you need to download a selenium driver. There are two ways in which you can use do this. You can either run selenium with your browser locally or run it remotely.

1. The first way is simply to run selenium locally. The driver you'll download depends from the browser you want to use and your operating system. To download the latest Selenium Webdriver go [here](https://www.seleniumhq.org/download/#selenium_ide).

2. This is the way i prefer most by using containers. You can go to official [Selenium DockerHub](https://hub.docker.com/u/selenium/) and look for a container with the browser you prefer most . After you choose your container just run it in whatsoever docker enviroment you have and voila. The image i used it's a setup of firefox. You can just run this container
``` docker run -p 4444:4444 -p 5900:5900  selenium/standalone-firefox-debug:2.53.1 ```
There are two exposed ports, the one you need to connect to is 4444 and the other (5000) is for a VNC connection. (password for the VNC should be **secret**)

To run script you need to download some npm dependencies with
```npm i``` 
and then run script with 
```npm start```

### After that See the Magic Happens!
![sample](https://user-images.githubusercontent.com/4427553/37987632-5fa08a52-3207-11e8-96bb-fc1c3eb81387.gif)
