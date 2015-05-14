module.exports = {

  integrations: {
    telldus: {
      endpoint: 'https://api.telldus.com/json/',
      publicKey: '',
      privateKey: '',
      accessToken: '',
      accessTokenSecret: ''
    },
    hue: {
      endpoint: 'http://192.168.83.140/api/hurricaneb'
    }
  },

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
