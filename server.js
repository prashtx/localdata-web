/*jslint node: true */
'use strict';

var request = require('request');
var connect = require('connect');
var s3 = require('connect-s3');

var port = process.env.PORT;

var reWeb = /^\/web(.*)/;

var app = connect()
.use(connect.compress())
.use(s3({
  pathPrefix: '/web',
  remotePrefix: process.env.STATIC_PREFIX
}))
.use(function (req, res) {
  if (req.url === '/') {
    res.statusCode = 302;
    res.setHeader('Location', req.url + 'web/');
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
})
.listen(port, function () {
  console.log('Listening on ' + port);
  console.log('Static prefix: ' + process.env.STATIC_PREFIX);
});
