'use strict';

const FS = require('graceful-fs');
const Path = require('path');

module.exports = class CommandIO {

  constructor() {
    this._quiet = false;
    this._base = null;
  }

  _ensurePath(path, appendBase = true) {
    if (Array.isArray(path)) {
      if (appendBase) {
        path.unshift(this.getBase());
      }
      return Path.join.apply(Path, path);
    }
    if (appendBase) {
      return Path.join(this.getBase(), path);
    }
    return Path.normalize(path);
  }

  quiet(quiet = true) {
    this._quiet = quiet;
    return this;
  }

  isQuiet() {
    return this._quiet;
  }

  base(path = null) {
    this._base = Path.normalize(path);
    return this;
  }

  getBase() {
    if (this._base === null) {
      return boot.setting('root');
    }
    return this._base;
  }

  nl(count = 1) {
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

  h1(text) {
    if (this.isQuiet()) return this;
    this.nl().out('-', text).nl();
    return this;
  }

  h2(text) {
    if (this.isQuiet()) return this;
    this.out('--', text).nl();
    return this;
  }

  error() {
    if (this.isQuiet()) return this;
    console.error.apply(console, arguments);
    return this;
  }

  fsMkDirs(path) {
    path = this._ensurePath(path, false);
    const parts = path.split(Path.sep);

    let p = this.getBase();
    for (const index in parts) {
      p = Path.join(p, parts[index]);
      if (!FS.existsSync(p)) {
        FS.mkdirSync(p);
        this.out('[FS] mkdir ' + this.subpath(p));
      }
    }
  }

  fsJson(path, value, overwrite = false) {
    path = this._ensurePath(path);
    if (overwrite || !FS.existsSync(path)) {
      FS.writeFileSync(path, JSON.stringify(value, null, 2));
      this.out('[FS] write json ' + this.subpath(path));
    }
    return this;
  }

  fsCopy(from, to, overwrite = false) {
    from = this._ensurePath(from);
    to = this._ensurePath(to);

    if (overwrite || !FS.existsSync(from)) {
      FS.createReadStream(from).pipe(FS.createWriteStream(to));
      this.out('[FS] copy from ' + this.subpath(from) + ' to ' + this.subpath(to));
    }
    return this;
  }

  rel(path) {
    path = Path.normalize(this._ensurePath(path, false));
    return path.substring(Path.normalize(this.getBase()).length + 1);
  }

  subpath(path, rootPath = null) {
    rootPath = rootPath || this.getBase();
    return '"..' + path.substring(rootPath.length) + '"';
  }

}
