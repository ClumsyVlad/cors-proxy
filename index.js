const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')

app = express();

app.use(bodyParser.json());

app.all('*', (req, res, next) => {

  // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

  if (req.method === 'OPTIONS') {
    // CORS Preflight
    res.send();
  } else {
    const targetURL = req.header('Target-URL'); // Target-URL ie. https://example.com or http://example.com
    if (!targetURL) {
      res.send(500, { error: 'There is no Target-Endpoint header in the request' });
      return;
    }
    request({ url: targetURL + req.url, method: req.method, json: req.body, headers: { 'Authorization': req.header('Authorization') } },
      (error, response, body) => {
        if (error) {
          console.error('error: ' + response.statusCode)
        }
        //                console.log(body);
      }).pipe(res);
  }
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log('Proxy server listening on port ' + app.get('port'));
});
