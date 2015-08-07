var Reflux = require('reflux')

var BuildActions = require('../Actions/BuildActions')

module.exports = Reflux.createStore({
  listenables: [BuildActions],
  onUpdate: function (build) {
    this.trigger({
      status: 'buildUpdated',
      data: build
    })
  },
  onDestroy: function (build) {
    this.trigger({
      status: 'buildDestroyed',
      data: build
    })
  }
})
