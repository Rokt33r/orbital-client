var React = require('react')
var Reflux = require('reflux')
var ReactRouter = require('react-router')
var Link = ReactRouter.Link
var RouteHandler = ReactRouter.RouteHandler
var Navigation = ReactRouter.Navigation

var Modal = require('../Mixins/Modal')
var Hq = require('../Services/Hq')
var AppStore = require('../Stores/AppStore')

var CreateAppModal = require('../Components/CreateAppModal')

module.exports = React.createClass({
  mixins: [Modal, Reflux.listenTo(AppStore, 'onListen'), Navigation],
  getInitialState: function () {
    return {
      user: null,
      isUserFetched: false
    }
  },
  propTypes: {
    params: React.PropTypes.shape({
      userName: React.PropTypes.string
    })
  },
  componentDidMount: function () {
    this.fetchUserData()
  },
  componentWillReceiveProps: function (nextProps) {
    if (this.state.user == null) {
      this.fetchUserData(nextProps.params)
      return
    }

    if (nextProps.params.userName !== this.state.user.name) {
      this.setState({
        user: null
      }, function () {
        this.fetchUserData(nextProps.params)
      })
    }
  },
  fetchUserData: function (params) {
    if (params == null) {
      params = this.props.params
    }

    Hq.getUser(params.userName)
      .then(function (res) {
        this.setState({user: res.body, isUserFetched: true})
      }.bind(this))
  },
  onListen: function (res) {
    var user = this.state.user
    if (user == null) {
      return
    }

    switch (res.status) {
      case 'appUpdated':
        if (res.data.OwnerId === user.id) {
          var isNew = !user.MyApps.some(function (app, index) {
            if (app.id === res.data.id) {
              user.MyApps.splice(index, 1, res.data)
              return true
            }
            return false
          })
          if (isNew) {
            user.MyApps.push(res.data)
          }

          this.setState({user: user})
        }
        break
      case 'appDestroyed':
        if (res.data.OwnerId === user.id) {
          user.MyApps.some(function (app, index) {
            if (app.id === res.data.id) {
              user.MyApps.splice(index, 1)
              return true
            }
            return false
          })

          this.setState({user: user})
        }
        break
    }
  },
  openCreateAppModal: function () {
    this.openModal(CreateAppModal, {transitionTo: this.transitionTo})
  },
  render: function () {
    if (!this.state.isUserFetched) {
      return (
        <div className='UserHomeContainer'>
          <div>Loading...</div>
        </div>
      )
    }
    var user = this.state.user

    var apps = user.MyApps.map(function (app) {
      return (
        <li key={'app-' + app.id}><Link to='appHome' params={{userName: user.name, appName: app.name}}>{app.profileName} ({user.name}/{app.name})</Link></li>
      )
    }, this)

    return (
      <div className='UserHomeContainer'>
        <div>User : {user.name}</div>
        <div className='appList'>
          <div className='appListHeader'>
            My apps <button onClick={this.openCreateAppModal}>Add a new app</button>
          </div>
          <ul>
            {apps}
          </ul>
        </div>
        <RouteHandler/>
      </div>
    )
  }
})
