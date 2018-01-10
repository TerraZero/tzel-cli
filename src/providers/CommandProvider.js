'use strict';

const Provider = use('core/Provider');
const Command = use('cli/annotations/Command');

/**
 * @Provider('provider.command')
 */
module.exports = class CommandProvider extends Provider.class {

  parsing(manifest, data) {
    const commands = manifest.getFromAnnotations(Command);

    if (commands.length) {
      manifest.register(this, 'commands', manifest.getKey());
    }
  }

}
