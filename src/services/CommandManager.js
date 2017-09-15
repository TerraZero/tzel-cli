'use strict';

const Command = use('cli/annotations/Command');
const yargs = require('yargs');

/**
 * @Service('manager.command')
 */
module.exports = class CommandManager {

  init() {
    const datas = boot.getDatas();

    for (const index in datas) {
      if (datas[index].hasTag(Command.name)) {
        new (use(datas[index].use()))(yargs);
      }
    }
    yargs.help().argv;
  }

}
