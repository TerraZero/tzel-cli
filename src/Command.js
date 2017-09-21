'use strict';

module.exports = class Command {

  constructor(yargs, io) {
    this._io = io;

    yargs.command({
      command: this.command(),
      aliases: this.aliases(),
      desc: this.description(),
      builder: this.build.bind(this),
      handler: this.execute.bind(this),
    });

    this.init(yargs);
  }

  command() { }

  aliases() { return []; }

  description() { }

  init(yargs) { }

  build(argv) { }

  execute(argv) { }

  io() {
    return this._io;
  }

}
