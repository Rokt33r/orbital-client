var React = require('react')
var LinkedState = require('../Mixins/LinkedState')
var Hq = require('../Services/Hq')
var BuildActions = require('../Actions/BuildActions')

module.exports = React.createClass({
  mixins: [LinkedState],
  propTypes: {
    close: React.PropTypes.func,
    app: React.PropTypes.shape({
      name: React.PropTypes.string,
      Owner: React.PropTypes.shape({
        name: React.PropTypes.string
      })
    })
  },
  getInitialState: function () {
    return {
      build: {}
    }
  },
  handleSubmit: function () {
    var app = this.props.app
    Hq.createBuild(this.state.build, app.Owner.name, app.name)
      .then(function (res) {
        BuildActions.update(res.body)
        this.props.close()
      }.bind(this))
      .catch(function (err) {
        console.error(err)
      })
  },
  render: function () {
    return (
      <div className='UploadBuildModal modal'>
        <div className='modalHeader'>
          <div className='modalTitle'>Create a new build</div>
        </div>
        <div className='form'>
          <div clasName='formField'>
            <label>Version</label>
            <input valueLink={this.linkState('build.version')} type='text'/>
          </div>
          <div clasName='formField'>
            <label>Name</label>
            <input valueLink={this.linkState('build.name')} type='text'/>
          </div>
          <div className='formField'>
            <label>Note</label>
            <textarea valueLink={this.linkState('build.notes')}/>
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
