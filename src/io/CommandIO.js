'use strict';

const Path = use('core/Path');
const FS = require('graceful-fs');

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

  fsExists(path) {
    path = Path.create(path);
    return FS.existsSync(path.norm());
  }

  fsMkDirs(path) {
    path = Path.create(path);
    const parts = path.parts();

    let p = path.root();
    for (const index in parts) {
      p = p.join(parts[index]);
      if (!FS.existsSync(p.norm())) {
        FS.mkdirSync(p.norm());
        this.out('[FS] mkdir ' + p.path());
      }
    }
  }

  fsJson(path, value, overwrite = false) {
    path = Path.create(path);
    if (overwrite || !FS.existsSync(path.norm())) {
      FS.writeFileSync(path.norm(), JSON.stringify(value, null, 2));
      this.out('[FS] write json ' + path.path());
    }
    return this;
  }

  fsCopy(from, to, overwrite = false) {
    from = Path.create(from);
    to = Path.create(to);

    if (overwrite || !this.fsExists(to)) {
      FS.writeFileSync(to.norm(), FS.readFileSync(from.norm()));
      this.out('[FS] copy from ' + from.path() + ' to ' + to.path());
    }
    return this;
  }

  fsRead(from) {
    from = Path.create(from);
    this.out('[FS] read file ' + from.path());
    return FS.readFileSync(from.norm(), ).toString();
  }

  fsWrite(to, content) {
    to = Path.create(to);
    this.out('[FS] write file ' + to.path());
    FS.writeFileSync(to.norm(), content);
    return this;
  }

  fsWriteJSON(to, json) {
    to = Path.create(to);
    this.out('[FS] write JSON file ' + to.path());
    FS.writeFileSync(to.norm(), JSON.stringify(json, null, 2));
    return this;
  }

  fsClearDir(path) {
    path = Path.create(path);
    const norm = path.norm();

    if (FS.existsSync(norm)) {
      this.out('[FS] clear directory ' + path.path());
      const files = FS.readdirSync(norm);

      for (const index in files) {
        if (!FS.lstatSync(norm + '/' + files[index]).isDirectory()) {
          FS.unlinkSync(norm + '/' + files[index]);
          this.out('[FS] delete file ' + path.join(files[index]).path());
        } else {
          this.out('[FS] delete only first level files can not delete directory ' + path.join(files[index]).path());
        }
      }
    }
    return this;
  }

}
