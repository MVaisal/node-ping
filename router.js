

/*
   This file responds to different http requests
*/


var url = require('url');
var mailer = require('./mailer');


function nodeza (req, res) {
  "use strict";

  var data = '';

  if (req.method === 'POST') {
    req.on('data', function(chunk) {
      data += chunk.toString();
    });

    req.on('end', function () {
      mailer({
        subject: 'Messge from NodeZA',
        body: data
      }, 
      function (err, message) {
        if (err) {
          console.log('Error! email not sent.');
        }
        else {
          console.log(message);
        }
      });

      res.writeHead(200);
      res.end();
    });
  }
  else {
    res.writeHead(501);
    res.end();
  }
}


function index (req, res, urls) {
  "use strict";

  var data = "Monitoring the following websites: \n \n" + urls.join("\n");

  res.end(data);
}



/*
   Expose our routes to the Global module object
*/
module.exports = function (urls) {
  "use strict";
    
  return function (req, res) {
    var path = url.parse(req.url).pathname, filename; 
    
    switch (path) {
      case '/':
        index(req, res, urls);
      break;
      
      case '/nodeza':
        nodeza(req, res);
      break;                  
      
      default:
        res.writeHead(401);
        res.end();
    }
  };
};