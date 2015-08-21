# Home Master Controller

![](http://qvintus.pharatropic.se/imagehost/viewImage/150516_1342.png)

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

Copy .hmc.conf.example to .hmc.conf in your home directory, and edit to fit your needs.

```
sudo npm install
bower install
node server.js
```

Also, make sure the time is set correctly on your system for the scheduler to work properly.

## Author
Written with love by Peter Leinonen, 2015.

## Thanks
Special thanks to my friend Henrik Boquist for providing all the hardware and devices to test on! :)


## Copyright
None, free to use by everybody! :D
