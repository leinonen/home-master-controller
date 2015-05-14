module.exports = {

  port: 8080,

  mongo: {
    url: '192.168.83.155:27017/masterHomeController_dev',
    opts: {
      server: {
        socketOptions: {
          keepAlive: 1
        }
      }
    }
  }
};
