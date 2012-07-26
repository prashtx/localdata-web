/*jslint node: true */
'use strict';

var request = require('request');
var connect = require('connect');

var staticPrefix = process.env.STATIC_PREFIX;
var port = process.env.PORT;

var reWeb = /^\/web(.*)/;

var app = connect()
.use(connect.compress())
.use(function (req, res) {
  var result = reWeb.exec(req.url);
  var newUrl;
  if (result !== null) {
    newUrl = staticPrefix + result[1];
    request.get({
      url: newUrl,
      followRedirect: false,
      encoding: null
    }, function (err, response, body) {
      if (response.statusCode === 302 ||
          response.statusCode === 301) {
        res.statusCode = response.statusCode;
        // S3 will return 302 Found if it found an index.html and wants to
        // redirect us to a directory-like URL (i.e. terminal forward slash)
        res.setHeader('Location', req.url + '/');
        res.end();
      } else {
        res.setHeader('content-type', response.headers['content-type']);
        res.setHeader('etag', response.headers['etag']);
        res.write(body);
        res.end();
      }
    });
  } else if (req.url === '/') {
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
  console.log('Static prefix: ' + staticPrefix);
});
