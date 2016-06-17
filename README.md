# cla

**C**ommand-**L**ine **A**wesome (`cla`) is the best command-line
options parser ever designed in the entire world by anyone who is me.

```sh
npm install --global cla
```

## Features

- Aliases: command expansions as arguments are parsed
- Infinitely nestable subcommands
- Modular [sub]command definitions
- Flag group expansions `-abc => -a -b -c`
- Double dash `--` ends parsing (by default)
- Type coersion and type system for option arguments
- Optional Express-style `Runner` for command paths
- Automatic help, man doc, and bash completion generators
- Strict parsing (unknown options are not parsed)
- Does not modify `process.argv`
- 3x shorter to type than `commander`

## Example

A simple echo command with an option to shout.

```js
const {parse, Command, Option, Types} = require('cla');

const Shout = Option({
  name: '--shout',
  description: 'say it annoyingly loud',
  key: 'shout',
  type: Types.Empty(true)
});

const Echo = Command({
  name: 'echo',
  description: 'says what you say to it',
  options: [Shout]
});

const options = parse(Echo, process.argv);

let words = options.args.join(' ');
if(options.shout) words = words.toUpperCase();
console.log(words);
```

```sh
echo Hello World
# => "Hello World" 
```

```sh
echo --shout wat
# => "WAT"
```

```sh
echo please do not --shout
# => "PLEASE DO NOT"
```

