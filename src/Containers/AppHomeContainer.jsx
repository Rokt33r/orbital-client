var React = require('react')
var Reflux = require('reflux')

var Modal = require('../Mixins/Modal')
var Hq = require('../Services/Hq')
var AppStore = require('../Stores/AppStore')
var BuildStore = require('../Stores/BuildStore')
var AppActions = require('../Actions/AppActions')
var BuildActions = require('../Actions/BuildActions')
var CreateBuildModal = require('../Components/CreateBuildModal')

module.exports = React.createClass({
  mixins: [Modal, Reflux.listenTo(AppStore, 'onListenFromApp'), Reflux.listenTo(BuildStore, 'onListenFromBuild')],
  propTypes: {
    params: React.PropTypes.shape({
      userName: React.PropTypes.string,
      appName: React.PropTypes.string
    })
  },
  getInitialState: function () {
    return {
      app: null
    }
  },
  componentDidMount: function () {
    this.fetchAppData()
  },
  componentWillReceiveProps: function (nextProps) {
    if (this.state.app == null) {
      this.fetchAppData(nextProps.params)
      return
    }

    if ((nextProps.params.appName !== this.state.app.name) || (nextProps.params.userName !== this.state.app.Owner.name)) {
      this.setState({
        app: null
      }, function () {
        this.fetchAppData(nextProps.params)
      })
    }
  },
  onListenFromApp: function (res) {
    var app = this.state.app
    if (app == null) return

    switch (res.status) {
      case 'appUpdated':
        if (app.id === res.data.id) {
          var _app = res.data
          _app.Builds = _app.Builds.sort(function (a, b) {
            if (a.createdAt > b.createdAt) {
              return -1
            }
            if (a.createdAt < b.createdAt) {
              return 1
            }
            return 0
          })
          this.setState({app: _app})
        }
        break
      case 'appDestroyed':
        if (app.id === res.data.id) {
          this.transitionTo('userHome', {userName: app.Owner.name})
        }
        break
    }
  },
  onListenFromBuild: function (res) {
    console.log(res)
    var app = this.state.app
    if (app == null) return

    var build = res.data
    switch (res.status) {
      case 'buildUpdated':
        if (app.id === build.AppId) {
          var isNew = !app.Builds.some(function (_build, index) {
            if (build.id === _build.id) {
              app.Builds.splice(index, 1, build)
              return true
            }
            return false
          })
          console.log(isNew)
          if (isNew) app.Builds.unshift(build)
          this.setState({app: app})
        }
        break
      case 'buildDestroyed':
        if (app.id === build.AppId) {
          app.Builds.some(function (_build, index) {
            if (build.id === _build.id) {
              app.Builds.splice(index, 1)
              return true
            }
            return false
          })
          this.setState({app: app})
        }
    }

  },
  fetchAppData: function (params) {
    if (params == null) {
      params = this.props.params
    }

    Hq.getApp(params.userName, params.appName)
      .then(function (res) {
        var app = res.body
        app.Builds = app.Builds.sort(function (a, b) {
          if (a.createdAt > b.createdAt) {
            return -1
          }
          if (a.createdAt < b.createdAt) {
            return 1
          }
          return 0
        })
        console.log(app.Builds)

        this.setState({app: app})
      }.bind(this))
  },
  openCreateBuildModal: function () {
    this.openModal(CreateBuildModal, {app: this.state.app})
  },
  publishBuild: function (buildId) {
    var params = this.props.params

    return function () {
      Hq.publishBuild(buildId, params.userName, params.appName)
        .then(function (res) {
          AppActions.update(res.body)
        })
        .catch(function (err) {
          console.error(err)
        })
    }
  },
  handleClickUpload: function (buildId) {
    return function () {
      React.findDOMNode(this.refs['fileInput-' + buildId]).click()
    }.bind(this)
  },
  uploadFileToBuild: function (build) {
    return function (e) {
      var file = e.target.files[0]
      e.target.value = null
      var app = this.state.app
      console.log(app.Owner.name, app.name, build.version)
      Hq.uploadFileToBuild(file, app.Owner.name, app.name, build.version)
        .then(function (res) {
          console.log(res.body)
          BuildActions.update(res.body)
        })
    }.bind(this)
  },
  render: function () {
    if (this.state.app == null) {
      return (
        <div className='AppHomeContainer'>
          Loading...
        </div>
      )
    }

    var app = this.state.app

    var builds = app.Builds.length > 0 ? app.Builds.map(function (build) {
      return (
        <li key={'build-' + build.id}>
          <div>{build.version} - {build.name} <span>{build.publishedAt == null ? 'Not published' : build.publishedAt}</span>
            {app.LatestBuildId === build.id ? (
              <button disabled={true}>Published :D</button>
            ) : (
              <button onClick={this.publishBuild(build.id)}>Publish as the latest</button>
            )}</div>
          <div>
            {build.url == null || build.url.length === 0 ? (
              <span>No build file</span>
            ) : (
              <a href={build.url}>{build.url}</a>
            )}
            <button onClick={this.handleClickUpload(build.id)}>Upload file</button>
            <input type='file' onChange={this.uploadFileToBuild(build)} style={{visibility: 'hidden'}} ref={'fileInput-' + build.id}/>
          </div>
          <div>{build.notes}</div>
        </li>
      )
    }, this) : (
      <li>This app has NO build :(</li>
    )

    return (
      <div className='AppHomeContainer'>
        <div>App : {app.profileName} ({app.Owner.name}/{app.name})</div>
        <div>{app.description}</div>
        <div>
          Builds <button onClick={this.openCreateBuildModal}>create new build</button>
          <ul>
            {builds}
          </ul>
        </div>
      </div>
    )
  }
})
