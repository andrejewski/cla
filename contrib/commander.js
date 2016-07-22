const parse = require('../lib/parse');
const Alias = require('../lib/alias');
const Command = require('../lib/command');
const Flag = require('../lib/flag');
const Option = require('../lib/option');
const Type = require('../lib/type');

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function append(dest, items) {
  if(!Array.isArray(items)) items = [items];
  items.forEach(item => dest.push(item));
}

class Commander {
  constructor(name, description) {
    this._command = Command({name, description});
    this._flags = [];
    this._aliases = [];
    this._options = [];
    this._commands = [];
  }

  name(name) {
    this._command.name = name;
    return this;
  }

  description(description) {
    this._command.description = description;
    return this;
  }

  version(version) {
    this._command.version = version;
    return this;
  }

  command(name, description) {
    let subcommand = null;
    if(typeof name === 'string') {
      subcommand = Command({name, description});
    } else if(subcommand instanceof Commander) {
      subcommand = subcommand.buildCommand();
    } else {
      subcommand = name;
    }
    append(this._command, subcommand);
    return this;
  }

  alias(name, expansion) {
    const alias = Alias(name, expansion);
    append(this._aliases, alias);
    return this;
  }

  flag(name, expansion) {
    const flag = Flag(name, expansion);
    append(this._flags, flag);
    return this;
  }

  option(name, description, type, defaultValue) {
    const names = name.split(',').map(s => s.trim());
    const aliasNames = names.filter(s => !s.startsWith('-'));
    const flagNames = names
      .filter(s => s.startsWith('-') && !s.startWith('--'));
    const optionNames = names.filter(s => s.startsWith('--'));
    if(optionNames.length !== 1) {
      throw new Error(`option("${name}") must contain one --option`);
    }
    const optionName = optionNames[0];
    const optionKey = optionName.slice(2).split('-')
      .map((word, index) => index ? capitalize(word) : word).join('');
    const option = Option({
      name: optionName,
      key: optionKey,
      type,
      description,
      defaultValue
    });
    const aliases = aliasNames.map(name => Alias(name, option));
    const flags = flagNames.map(name => Flag(name, option));
    append(this._options, option);
    append(this._aliases, aliases);
    append(this._flags, flags);
    return this;
  }

  buildCommand() {
    return Object.assign(this._command, {
      flags: this._flags,
      aliases: this._aliases,
      options: this._options,
      commands: this._commands
    });
  }

  parse(argv) {
    const command = this.buildCommand();
    return parse(command, argv);
  }
}

module.exports = Commander;
