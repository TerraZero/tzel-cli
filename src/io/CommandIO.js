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

    if (overwrite || !FS.existsSync(from.norm())) {
      FS.createReadStream(from.norm()).pipe(FS.createWriteStream(to.norm()));
      this.out('[FS] copy from ' + from.path() + ' to ' + to.path());
    }
    return this;
  }

}
