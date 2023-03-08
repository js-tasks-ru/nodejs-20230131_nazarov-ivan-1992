const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.usedSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.usedSize += Buffer.byteLength(chunk);
    if (this.usedSize > this.limit) {
      callback(new LimitExceededError(), chunk)
    } else {
      callback(null, chunk)
    }
  }
}

module.exports = LimitSizeStream;
