'use strict';

const Annotation = use('core/reflect/Annotation');

module.exports = class Command extends Annotation.class {

  static get targets() { return [this.DEFINITION] }

  static get extendable() { return false }

};
