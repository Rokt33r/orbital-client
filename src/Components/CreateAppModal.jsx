/* global localStorage */

var React = require('react')
var LinkedState = require('../Mixins/LinkedState')
var Hq = require('../Services/Hq')
var AppActions = require('../Actions/AppActions')

module.exports = React.createClass({
  mixins: [LinkedState],
  propTypes: {
    close: React.PropTypes.func,
    transitionTo: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      app: {}
    }
  },
  handleSubmit: function () {
    Hq.createApp(this.state.app)
      .then(function (res) {
        var app = res.body

        AppActions.update(app)
        this.props.close()
        var userName = JSON.parse(localStorage.getItem('currentUser')).name
        this.props.transitionTo('appHome', {userName: userName, appName: app.name})
      }.bind(this))
      .catch(function (err) {
        console.error(err)
      })
  },
  render: function () {
    return (
      <div className='CreateAppModal modal'>
        <div className='modalHeader'>
          <div className='modalTitle'>Create a new app</div>
        </div>
        <div className='form'>
          <div clasName='formField'>
            <label>App name</label>
            <input valueLink={this.linkState('app.name')} type='text'/>
          </div>
          <div clasName='formField'>
            <label>Profile name</label>
            <input valueLink={this.linkState('app.profileName')} type='text'/>
          </div>
          <div className='formField'>
            <label>Description</label>
            <textarea valueLink={this.linkState('app.description')}/>
          </div>
          <div className='formControl'>
            <button onClick={this.props.close}>Cancel</button>
            <button onClick={this.handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    )
  }
})
