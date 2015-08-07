require('./styles/index.styl')

var React = require('react/addons')

var ReactRouter = require('react-router')
var Route = ReactRouter.Route
var DefaultRoute = ReactRouter.DefaultRoute

var MainContainer = require('./Containers/MainContainer')

var LoginContainer = require('./Containers/LoginContainer')
var RegisterContainer = require('./Containers/RegisterContainer')

var AppListContainer = require('./Containers/AppListContainer')

var UserHomeContainer = require('./Containers/UserHomeContainer')
var AppHomeConatiner = require('./Containers/AppHomeContainer')

var routes = (
  <Route path='/' handler={MainContainer}>
    <DefaultRoute name='home'/>
    <Route name='login' path='login' handler={LoginContainer}/>
    <Route name='register' path='register' handler={RegisterContainer}/>
    <Route name='apps' path='apps' handler={AppListContainer}/>
    <Route name='user' path=':userName' handler={UserHomeContainer}>
      <DefaultRoute name='userHome'/>
      <Route name='app' path=':appName' handler={AppHomeConatiner}>
        <DefaultRoute name='appHome'/>
      </Route>
    </Route>
  </Route>
)

ReactRouter.run(routes, ReactRouter.HashLocation, function (Root) {
  React.render(<Root/>, document.getElementById('content'))
})
