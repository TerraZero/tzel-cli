'use strict';

const Command = use('cli/Command');

/**
 * @Command
 */
module.exports = class Test2Command extends Command.class {

  command() {
    return 'test2 <z|f> [h]';
  }

  aliases() { return ['cool2']; }

  description() {
    return 'Test2 Command';
  }

  build(argv) {
  }

  execute(argv) {
  }

}
