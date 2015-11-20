# Home Master Controller

Control and automate your home from one place!
Supports Tellstick Net, Philips Hue and Z-Wave (RaZberry) devices.

![](http://pharatropic.eu/images/20c462ccc7ac8780b321d2543bed03ed.png)

## Requirements
* NodeJS 4.2.0 or better
* MongoDB (for settings, users etc)
* A Raspberry Pi (optional but required for z-wave)
* RaZberry Z-Wave controller (optional)

## Featured devices
* Telldus Net devices, sensors and groups
* Philips Hue lights and groups
* Z-Wave (RaZberry) devices and sensors

## Features
* Create custom groups containing any kind of (featured) device.
* Scheduler for automatic on/off switching
* Start/stop devices on sunset or sunrise (scheduler)
* Random offset for scheduler (Broken atm, will be fixed soon)
* Color looping for Philips Hue lights
* Custom API that can easily be extended to support other devices!
* 100% NodeJS and AngularJS
* Uses some ES6 features like arrow functions (will use more ES6 features later)
* Heavy use of promises (Using q library), for nice and readable code!
* Bootstrap for responsive design that looks nice on all devices

## Installation

If you want to use Z-Wave, make sure you have installed your RaZberry z-wave controller first.

Edit config.json to fit your needs, for example default username and password.

```
$ cd src
$ sudo npm install
$ bower install
```
And now, you run the application:

```
$ node server.js
```

You can also pass arguments that will override the values in the config file:

```
$ node server.js --PORT=8000 --MONGO_URL=mongoserver.myhost:27017/hmc_test

```

## Running with docker-compose on RPI (including MongoDB)
I prefer using HypriotOS, because docker and docker-compose are pre-installed.
The docker-compose.yml uses a linked MongoDB image, so you don't need to have it installed.
You can also edit docker-compose.yml and add environment variables to override the config file values.

```
$ docker-compose build
$ docker-compose up
```

Or to run as daemon:

```
$ docker-compose up -d
```

Also, make sure the time is set correctly on your system for the scheduler to work properly.

## Author
Written with love by Peter Leinonen, 2015.

## Thanks
Special thanks to my friend Henrik Boquist for providing all the hardware and devices to test on! :)

## Copyright
None, free to use by everybody! :D
