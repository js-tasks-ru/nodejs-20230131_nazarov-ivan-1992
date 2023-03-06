const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs')
const limitSizeStream = require('./LimitSizeStream.js')

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (path.parse(pathname).dir) {
        res.statusCode = 400;
        res.end('Bad Request');

        break;
      }

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('Already exist');

        break;
      }

      let streamError;

      let writeStream = fs.createWriteStream(filepath);
      let limitStream = new limitSizeStream({ limit: 1024 * 1024 });

      req.pipe(limitStream).pipe(writeStream);

      req.on('aborted', () => {
        limitStream.end();
        writeStream.end();
        streamError = {code: 'ABORTED'}
      });

      writeStream.on('finish', () => {
        if (streamError) {
          if (fs.existsSync(filepath)) {
              fs.unlinkSync(filepath);
          }

          if (streamError.code === 'LIMIT_EXCEEDED'){
            res.statusCode = 413;
            res.end('LIMIT_EXCEEDED')
          } else if (streamError.code !== 'ABORTED') {
            res.statusCode = 500;
            res.end(streamError.code)
          }
        } else {
          res.statusCode = 201;
          res.end('Done');
        }
      });

      limitStream.on('error', (err) => {
        streamError = err;
        writeStream.end();
      });

      writeStream.on('error', (err) => {
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        res.statusCode = 500;
        res.end(err.code)
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
