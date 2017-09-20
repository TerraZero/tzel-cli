'use strict';

const Command = use('cli/annotations/Command');

/**
 * @Service('manager.command')
 */
module.exports = class CommandManager {

  execute(args) {
    this.getYargs(require('yargs')(args)).argv;
  }

  getYargs(yargs = null) {
    if (yargs === null) yargs = require('yargs');
    const datas = boot.getDatas();

    for (const index in datas) {
      if (datas[index].hasTag(Command.name)) {
        new (use(datas[index].use()))(yargs);
      }
    }
    return yargs.help();
  }

}
