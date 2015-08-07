/* global localStorage */

var request = require('superagent-promise')(require('superagent'), Promise)
var apiUrl = require('../config').apiUrl

module.exports = {
  login: function (input) {
    return request
      .post(apiUrl + 'auth')
      .send(input)
  },
  register: function (input) {
    return request
      .post(apiUrl + 'auth/signup')
      .send(input)
  },
  getUser: function (userName) {
    return request
      .get(apiUrl + userName)
  },
  createApp: function (input, userName) {
    if (userName == null) {
      userName = JSON.parse(localStorage.getItem('currentUser')).name
    }
    return request
      .post(apiUrl + userName + '/apps')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
  },
  getApp: function (userName, appName) {
    return request
      .get(apiUrl + userName + '/' + appName)
  },
  createBuild: function (input, userName, appName) {
    return request
      .post(apiUrl + userName + '/' + appName + '/builds')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
  },
  uploadFileToBuild: function (file, userName, appName, buildVersion) {
    return request
      .post(apiUrl + userName + '/' + appName + '/builds/' + buildVersion + '/file')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .attach('file', file, file.name)
  },
  destroyBuild: function (userName, appName, buildVersion) {
    return request
      .del(apiUrl + userName + '/' + appName + '/builds/' + buildVersion)
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
  },
  publishBuild: function (buildId, userName, appName) {
    return request
      .post(apiUrl + userName + '/' + appName + '/latest')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send({
        buildId: buildId
      })
  }
}
