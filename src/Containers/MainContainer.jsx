/* global localStorage */

var React = require('react')
var ReactRouter = require('react-router')
var Link = ReactRouter.Link
var RouteHandler = ReactRouter.RouteHandler

module.exports = React.createClass({
  mixins: [ReactRouter.Navigation, ReactRouter.State],
  componentDidMount: function () {
  },
  logout: function () {
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')

    this.transitionTo('login')
  },
  render: function () {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'))
    var guestNavigator = (currentUser == null) ? (
      <div className='homeControl'><Link to='login'>Log In</Link> / <Link to='register'>Sign Up</Link></div>
    ) : (
      <div className='homeControl'>
        <div>Welcome you, <Link to='userHome' params={{userName: currentUser.name}}>{currentUser.profileName}</Link></div>
        <button onClick={this.logout}>Log out</button>
      </div>
    )

    var content = this.isActive('home') ? (
      <div className='home'>
        <h1>Orbital Command</h1>
        {guestNavigator}
      </div>
    ) : null
    return (
      <div className='MainContainer'>
        {content}
        <RouteHandler/>
      </div>
    )
  }
})
