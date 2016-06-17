
const defaultOptions = {
  type: 'command',
  aliases: [],
  commands: [],
  options: [],
  flags: []
};

function Command(options) {
  const {name} = options;
  if(!name) {
    throw new Error(`Commands require a 'name'.`);
  }
  return Object.assign(defaultOptions, commandOptions);
}

module.exports = Command;

