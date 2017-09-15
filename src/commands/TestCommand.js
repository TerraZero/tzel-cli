'use strict';

const Command = use('cli/Command');

/**
 * @Command
 */
module.exports = class TestCommand extends Command.class {

  command() {
    return 'test <z|f> [h]';
  }

  aliases() {
    return ['cool'];
  }

  description() {
    return 'Test Command';
  }

  build(yargs) {
    return yargs.option('u', {
      alias: 'url',
      describe: 'the URL to make an HTTP request to',
    });
  }

  execute(argv) {
    log(argv);
  }

}
