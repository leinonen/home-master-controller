# Home Master Controller

![](http://qvintus.pharatropic.se/imagehost/viewImage/150516_1342.png)

Control your home from one place!
Supports Tellstick Net and Philips Hue.

Uses MongoDB for storage. Make sure you have it!

## Features
* Telldus Net devices and groups
* Philips Hue lights and groups
* Custom API that can easily be extended to support other devices!
* 100% NodeJS and AngularJS
* Heavy use of promises (Using q library), for nice and readable code!
* Bootstrap for responsive design

## Installation

Edit `server/config.js` to set up port and MongoDB. Default port is 8080.


```
sudo npm install
bower install
node server.js
```

## Author
Written with love by Peter Leinonen, 2015.


## Copyright
None, free to use by everybody! :D
