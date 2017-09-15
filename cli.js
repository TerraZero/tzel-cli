#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const tzel = fs.existsSync(path.join(process.cwd(), 'tzel.json'));
const index = fs.existsSync(path.join(process.cwd(), 'index.js'));

if (!tzel || !index) {
  console.error('ERROR: No tzel root found!');
  return;
}

require(path.join(process.cwd(), 'index.js'));

const commands = use('manager.command');
commands.init();
