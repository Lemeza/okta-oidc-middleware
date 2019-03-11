const express = require('express');
const app = express();
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const fs = require('fs');

const oidc = new ExpressOIDC({
    issuer: 'https://dev-836551.okta.com/oauth2/default',
    client_id: '0oachvnffo5nUybn3356',
    client_secret: 'AQLPfhV1CZl7saaF1SmRxHtQrcbvSGrCnFCNS2Se',
    redirect_uri: 'http://localhost:8080/authorization-code/callback',
    appBaseUrl: 'http://localhost:8080',
    scope: 'openid profile'
});

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'its_a_secret_to_everybody' 
  }));

app.use(oidc.router);

app.get('/', (req, res, next) => {
    res.send('Welcome Home');
});

app.get('/protected', oidc.ensureAuthenticated(), (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile('protected.html', function (err, data) {
        res.write(data);
        res.end();
    });
});

let server = app.listen(8080, () => {
  console.log("Rest app listening at http://%s:%s", server.address().address, server.address().port);
});