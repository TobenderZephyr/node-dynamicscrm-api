var fs = require('fs')
var exec = require('child_process').exec
var request = require("request");

var NEW_NODE_PATH = '/home/deploy/node-v4.9.1-linux-x64/bin/node'

try {
    fs.statSync(NEW_NODE_PATH)

    var request = function (opts, callback) {
        var opts = Buffer.from(JSON.stringify(opts)).toString('base64')

        exec(NEW_NODE_PATH + ' ' + __dirname + '/proxy_requester.js ' + opts, function (err, stdout, stderr) {
          var results = JSON.parse(stdout)
          callback(results.err, results.res, results.body)
        })
    }
} catch(err) {
    // console.log("ERROR", err)

    var request = function (opts, callback) {
        console.log("MAKING PROXY REQUEST", opts, __dirname + '/proxy_requester.js ' + JSON.stringify(opts))
        var opts = Buffer.from(JSON.stringify(opts)).toString('base64')

        exec('node ' + __dirname + '/proxy_requester.js ' + opts, function (err, stdout, stderr) {
          var results = JSON.parse(stdout)
          callback(results.err, results.res, results.body)
        })
    }
}


var opts = {
  uri: 'http://www.google.com',
  method: 'GET'
}

request(opts, function(err, res, body) {
  console.log("FINAL RESULTS", err, res, body)
})