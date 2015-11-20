# Home Master Controller

![](http://pharatropic.eu/images/20c462ccc7ac8780b321d2543bed03ed.png)

Control your home from one place!
Supports Tellstick Net, Philips Hue and Z-Wave (RaZberry) devices.

Uses MongoDB for storage. Make sure you have it!

## Featured devices
* Telldus Net devices, sensors and groups
* Philips Hue lights and groups
* Z-Wave (RaZberry) devices and sensors

## Features
* Create custom groups containing any kind of (featured) device.
* Scheduler for automatic on/off switching
* Sunset and sunrise options for scheduler
* Random offset for scheduler
* Color looping for Philips Hue lights
* Custom API that can easily be extended to support other devices!
* 100% NodeJS and AngularJS
* Heavy use of promises (Using q library), for nice and readable code!
* Bootstrap for responsive design that looks nice on all devices

## Installation

Edit config.json to fit your needs. Default username and password.

```
$ cd src
$ sudo npm install
$ bower install
```
And now, you run the appication:

```
$ node server.js
```

You can also pass arguments that will override the values in the config file:

```
$ node server.js --PORT=8000 --MONGO_URL=mongoserver.myhost:27017/hmc_test

```

## Running with docker-compose on RPI
I prefer using HypriotOS, because docker and docker-compose are pre-installed.
The docker-compose.yml uses a linked mongodb image, so you don't need to have it installed.
```
docker-compose build
docker-compose up
```

Also, make sure the time is set correctly on your system for the scheduler to work properly.

## Author
Written with love by Peter Leinonen, 2015.

## Thanks
Special thanks to my friend Henrik Boquist for providing all the hardware and devices to test on! :)


## Copyright
None, free to use by everybody! :D
