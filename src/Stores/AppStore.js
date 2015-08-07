var Reflux = require('reflux')

var AppActions = require('../Actions/AppActions')

module.exports = Reflux.createStore({
  listenables: [AppActions],
  onUpdate: function (app) {
    this.trigger({
      status: 'appUpdated',
      data: app
    })
  },
  onDestroy: function (app) {
    this.trigger({
      status: 'appDestroyed',
      data: app
    })
  }
})
