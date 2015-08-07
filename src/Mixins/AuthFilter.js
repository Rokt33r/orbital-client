/* global localStorage*/

var mixin = {}

mixin.OnlyGuest = {
  componentDidMount: function () {
    var user = localStorage.getItem('currentUser')

    if (user == null) {
      return
    }
    this.transitionTo('home')
  }
}

mixin.OnlyUser = {
  componentDidMount: function () {
    var user = localStorage.getItem('currentUser')

    if (user == null) {
      this.transitionTo('login')
      return
    }
  }
}

module.exports = mixin
