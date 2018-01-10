'use strict';

const CommandIO = use('cli/io/CommandIO');
const Manifest = use('core/reflect/Manifest');

/**
 * @Service('manager.command')
 */
module.exports = class CommandManager {

  execute(args, io = null) {
    this.getYargs(require('yargs')(args), io).argv;
  }

  getYargs(yargs = null, io = null) {
    if (yargs === null) yargs = require('yargs');
    if (io === null) io = new CommandIO();
    const commands = Manifest.getRegister('provider.command', 'commands');

    for (const key of commands) {
      new (use(key))(yargs, io);
    }

    const that = this;

    return yargs
      .option('quiet', {
        alias: 'q',
        describe: 'quiet the command',
        type: 'boolean',
      })
      .check(function (io) {
        return function (argv) {
          return that._quietCheck(argv, io);
        };
      }(io))
      .help();
  }

  _quietCheck(argv, io) {
    if (argv.quiet) {
      io.quiet();
    }
    return true;
  }

}
