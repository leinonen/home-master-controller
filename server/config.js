module.exports = {

  port: 8080,

  // Location for correct sunrise and sunset calculation
  location: {
    // Gothenburg
    lat: 57.7,
    lng: 11.9667
  },

  userRoles: ['guest', 'user', 'admin'],
  secrets: {
    session: 'secret'
  },

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
