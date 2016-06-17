
/*
Expansions
==========
Expression  : Alias | Command | Flag | Option | string
Expansion   : Expression | [Expression...]
*/

function normalizeExpansion(expansion) {
  if(!Array.isArray(expansion)) expansion = [expansion];
  /*
  const argumentedOptions = expansion
    .filter(x => x.type === 'option' && hasMultipleArguments(x));
  const hasOptions = argumentedOptions.length;
  const hasSingleOption = argumentedOptions.length === 1;
  const lastIsOption = expansion.slice(-1)[0].type === 'option';
  if(hasOptions && !(hasSingleOption && lastIsOption)) {
    const message = `
      Expansions can only have at most one unsupplied option
      that takes arguments and that option has to be last.
    `.split('\n').map(x => x.trim()).join(' ').trim();
    throw new Error(message);
  }
  */
  return expansion;
}

function hasMultipleArguments(option) {
  // unsure until type are implemented
}

module.exports = {normalizeExpansion};

