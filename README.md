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
- Optional automatic `help` command
- Strict parsing: unknown options are not parsed
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

## Routing

Included routing for commands and subcommands is inspired by
how you would create Connect/Express routes. This `Runner` utility
is completely optional and not needed to use `cla`.

```js
const {parse, Runner} = require('cla');
const npm = require('./npm-command);
const npmInstall = require('./npm-install-command');
const npmUpdate = require('./npm-update-command');
const options = parse(command);

Runner()
  .use((options, next) => {
    // process options and call next to go to the next route
    // use next(error) to stop processing
    next();
  })
  .use(npmInstall, (options, next) => {
    // this will only be run if the install subcommand is used
    next();
  })
  .use('install', (options, next) => {
    // command names are equivalent but less modular
    next();
  })
  .use(npmUpdate, Runner()
    .use((options, next) => {
      // runners can be nested for even more modularity
    }))
  .run(options, (error) => {
    // any error will stop processing and call this callback
    // it will also be called if the end of routes is reached
  });
```

