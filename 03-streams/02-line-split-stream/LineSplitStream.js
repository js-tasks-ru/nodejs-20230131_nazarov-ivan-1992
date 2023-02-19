const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.stringPart = ''
  }

  _transform(chunk, encoding, callback) {
    chunk = chunk.toString();
    let lines = chunk.split(os.EOL);

    if (lines.length === 1){
      this.stringPart += chunk;
    } else {
      lines[0] = this.stringPart + lines[0];
      this.stringPart = lines.at(-1)
      lines.slice(0, -1).forEach(el => {
        this.push(el);
      })
    }
    callback();
  }

  _flush(callback) {
    if (this.stringPart) {
      this.push(this.stringPart);
    }
    callback();
  }
}

module.exports = LineSplitStream;
