var express = require('express');
var app = express();

app.use(express.static('.'))

var port = process.env.PORT || 8080

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});