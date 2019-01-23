var request = require("request")

var encoded = process.argv[2]
var decoded = Buffer.from(encoded, 'base64').toString('ascii')
var opts = JSON.parse(decoded)
request(opts, function(err, res, body) {
    var results = {
        err: err,
        res: res,
        body: body
    }
    
    console.log(JSON.stringify(results, null, 2))
})