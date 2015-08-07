/* global localStorage */

var React = require('react')
var ReactRouter = require('react-router')
var Link = ReactRouter.Link

var AuthFilter = require('../Mixins/AuthFilter')
var LinkedState = require('../Mixins/LinkedState')
var Hq = require('../Services/Hq')

module.exports = React.createClass({
  mixins: [AuthFilter.OnlyGuest, ReactRouter.Navigation, LinkedState],
  getInitialState: function () {
    return {
      user: {}
    }
  },
  handleSubmit: function () {
    Hq.login(this.state.user)
      .then(function (res) {
        localStorage.setItem('token', res.body.token)
        localStorage.setItem('currentUser', JSON.stringify(res.body.user))
        this.transitionTo('home')
      }.bind(this))
      .catch(function (err) {
        console.log(err)
      })
  },
  render: function () {
    return (
      <div className='LoginContainer'>
        <h1>Orbital</h1>
        <h2><Link to='login'>Log In</Link> / <Link to='register'>Sign Up</Link></h2>
        <div className='form'>
          <div className='formField'>
            <label>E-mail</label>
            <input valueLink={this.linkState('user.email')} type='text'/>
          </div>
          <div className='formField'>
            <label>Password</label>
            <input valueLink={this.linkState('user.password')} type='password'/>
          </div>
          <div className='formControl'>
            <button onClick={this.handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    )
  }
})
