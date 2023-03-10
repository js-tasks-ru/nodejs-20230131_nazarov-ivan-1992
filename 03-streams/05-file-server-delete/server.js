const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs')

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (path.parse(pathname).dir) {
        res.statusCode = 400;
        res.end('Bad Request');

        break;
      }

      if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end('Does not exist');

        break;
      }

      fs.unlinkSync(filepath);
      res.statusCode = 200;
      res.end('Done');

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
