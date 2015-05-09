module.exports = {
  endpoint: 'https://api.telldus.com/json/',
  publicKey: '',
  privateKey: '',
  accessToken: '',
  accessTokenSecret:'',

  port: 8080,

  hueEndpoind: 'http://192.168.83.140/api/hurricaneb',

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
