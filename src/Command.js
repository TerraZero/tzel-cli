'use strict';

module.exports = class Command {

  constructor(yargs) {
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

  out() {
    console.log.apply(console, arguments);
  }

}
