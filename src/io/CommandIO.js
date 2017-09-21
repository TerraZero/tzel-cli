'use strict';

const FS = require('graceful-fs');
const Path = require('path');

module.exports = class CommandIO {

  constructor() {
    this._quiet = false;
  }

  quiet(quiet = true) {
    this._quiet = quiet;
    return this;
  }

  isQuiet() {
    return this._quiet;
  }

  newline(count = 1) {
    if (this.isQuiet()) return this;
    for (let i = 0; i < count; i++) {
      this.out();
    }
    return this;
  }

  out() {
    if (this.isQuiet()) return this;
    console.log.apply(console, arguments);
    return this;
  }

  error() {
    if (this.isQuiet()) return this;
    console.error.apply(console, arguments);
    return this;
  }

  fsJson(path, value, always = false) {
    path = this._ensurePath(path);
    if (!FS.existsSync(path) || always) {
      FS.writeFileSync(path, JSON.stringify(value, null, 2));
      this.out('[FS] write json ' + this._subpath(path));
    }
    return this;
  }

  _ensurePath(path) {
    if (Array.isArray(path)) {
      return Path.join.apply(Path, path);
    }
    return Path.normalize(path);
  }

  _subpath(path, rootPath = null) {
    rootPath = rootPath || boot.setting('root');
    return '"..' + path.substring(rootPath.length) + '"';
  }

}
