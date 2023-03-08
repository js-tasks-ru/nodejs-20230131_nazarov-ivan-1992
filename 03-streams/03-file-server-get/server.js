const url = require('url')
const http = require('http')
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
    req.setEncoding('UTF8');
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname.slice(1);

    const filepath = path.join(__dirname, 'files', pathname);

    switch (req.method) {
        case 'GET':

            if (path.parse(pathname).dir){
                res.statusCode = 400;
                res.end('Bad Request\n');

                break;
            } 
            
            if (!fs.existsSync(filepath)) {
                res.statusCode = 404;
                res.end('Not found\n');

                break;
            }

            const stream = fs.createReadStream(filepath);
            stream.pipe(res)
              

            break;

        default:
            res.statusCode = 501;
            res.end('Not implemented');
    }

});

module.exports = server;