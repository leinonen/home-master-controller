module.exports = {

  integrations: {
    telldus: {
      endpoint: 'https://api.telldus.com/json/',
      publicKey: 'FEHUVEW84RAFR5SP22RABURUPHAFRUNU',
      privateKey: 'ZUXEVEGA9USTAZEWRETHAQUBUR69U6EF',
      accessToken: '441ff4dd3e4465db02e6f75e21ccade3055075761',
      accessTokenSecret: 'ec697a4ecf7ee6f91902c800e26fdc9c'
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
