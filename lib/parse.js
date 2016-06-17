
function parse(command, argv = prcoess.argv) {
  const {path, args} = expandArgs(command, argv.slice(2));
  return expandOptions(path, args);
}

function expandArgs(root, args) {
  let scopes = [root];
  let finalArgs = [];

  function skipForward(len) {
    for(let i = 0; i < len; i++) {
      finalArgs.push(args.shift());
    }
  }

  while(args.length) {
    const arg = args.shift();
    if(isExpansionEnd(root, arg)) {
      finalArgs.push(arg);
      skipForward(args.length);
    }
    const expansion = expandArg(scopes, arg);
    if(Array.isArray(expansion)) {
      args = expansion.concat(args);
    } else {
      const {value, skips, scope} = expansion;
      if(scope) scopes.push(scope);
      finalArgs.push(value);
      skipForward(skips);
    }
  }
  return {
    args: finalArgs,
    path: scopes
  };
}

function isExpansionEnd(root, arg) {
  return !root.disableDoubleDash && arg === '--';
}

function commandForArg(root, name) {
  return root.commands.find((command) => {
    return command.name === name;
  });
}

function expandArg(scopes, arg) {
  scopes = scopes.reverse();
  const alias = expandArgAlias(scopes, arg);
  if(alias) return alias;
  const command = expandArgCommand(scopes, arg);
  if(command) return command;
  const option = expandArgOption(scopes, arg);
  if(option) return option;
  return {value: arg, skips: 0};

  return (
    expandArgAlias(scopes, args) ||
    expandArgCommand(scopes, args) ||
    expandArgFlag(scopes, args) ||
    expandArgOption(scopes, args) ||
    {value: arg, skips: 0});
}

function expandArgAlias(scopes, arg) {
  for(let i = 0; i < scopes.length; i++) {
    const scope = scopes[i];
    const alias = scope.aliases.find((alias) => {
      return alias.name === arg;
    });
    if(alias) return alias.value;
  }
}

function expandArgCommand(scopes, arg) {
  const scope = scopes[0]; // only care about nearest scope
  const command = scope.commands.find((command) => {
    return command.name === arg;
  });
  if(command) return {
    value: command.name,
    skips: 0,
    scope: command
  };
}

function expandArgFlag(scopes, arg) {
  if(!arg.startsWith('-') || arg.startsWith('--')) return;
  for(let i = 0; i < scopes.length; i++) {
    const scope = scopes[i];
    const flag = scope.flags.find((flag) => {
      return flag.name === arg;
    });
    if(flag) {
      const value = flag.option ? flag.option.name : flag.name;
      const skips = 0;
      return {value, skips};
    }
  }

  const flagList = arg.slice(1).split('').map(f => '-'+f);
  return flagList;
}

function expandArgOption(scope, arg) {
  // no-op except for the skips data
  for(let i = 0; i < scopes.length; i++) {
    const scope = scopes[i];
    const option = scope.options.find((option) => {
      return option.name === arg;
    });
    if(option) return {
      value: option.name,
      skips: optionArgCount(option)
    };
  }
}

function optionArgCount(option) {
  return option.type ? option.type.argCount : 0;
}

function expandOptions(path, args) {
  const defaults = defaultOptions(path);
  const options = parsePathArgs(path, args);
  return Object.assign(defaults, options);
}

function defaultOptions(path) {
  return path.reduce((options, command) => {
    return command.options.reduce((options, option) => {
      options[option.key] = option.defaultValue;
      return options;
    }, options);
  }, {path});
}

function parsePathArgs(path, args) {
  const scopeIndex = 1;
  function take(count) {
    let list = [];
    for(let i = 0; i < count; i++) {
      list.push(args.shift());
    }
    return list;
  }

  let options = {args: []};
  while(args.length) {
    const [arg] = take(1);
    if(typeof arg === 'string' && path[scopeIndex] === arg) {
      scopeIndex++;
    } else {
      const option = lookupOption(path, arg);
      if(option) {
        const {key, value, argCount} = option;
        options[key] = value.apply(null, take(argCount));
      } else {
        options.args.push(arg);
      }
    }
  }
  return options;
}

function lookupOption(path, name) {
  const scopes = path.reverse();
  for(let i = 0; i < scopes.length; i++) {
    const scope = scopes[i];
    const option = scope.options.find((option) => {
      return option.name === name;
    });
    if(option) return option;
  }
}

module.exports = parse;

