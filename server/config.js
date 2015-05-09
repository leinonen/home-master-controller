module.exports = {
  endpoint: 'https://api.telldus.com/json/',
  publicKey: '',
  privateKey: '',
  accessToken: '',
  accessTokenSecret:'',

  port: 8080,

  hueEndpoind: '',

  mongo: {
    url: '',

    opts: {
      server: {
        socketOptions: {
          keepAlive: 1
        }
      }
    }
  }
};
