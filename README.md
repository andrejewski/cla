# Command-Line Awesome

Command-Line Awesome is the best command-line options parser
ever designed in the entire world by anyone who is me.

```sh
npm install --global cla
```

## Features

- Aliases: command expansions as arguments are parsed
- Infinitely nestable subcommands
- Modular [sub]command definitions
- Flag group expansions `-abc => -a -b -c`
- Double dash `--` ends parsing (by default)
- Type coersion and extensible type system for option arguments
- Optional Express-style `Runner` for command paths
- Optional automatic `help` output generator
- Strict parsing: unknown options are not parsed
- Does not modify `process.argv`
- 3x shorter to type than `commander`

## Example

A simple echo command with an option to shout.

```js
const {parse, Command, Option, Type} = require('cla');

const Shout = Option({
  name: '--shout',
  description: 'say it annoyingly loud',
  key: 'shout',
  type: Type.Empty(true)
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

## Contributing

Contributions are incredibly welcome as long as they are standardly applicable
and pass the tests (or break bad ones). Tests are written in Mocha and
assertions are done with the Node.js core `assert` module.

```bash
# running tests
npm run test
```

Follow me on [Twitter](https://twitter.com/compooter) for updates or just for
the lolz and please check out my other [repositories](https://github.com/andrejewski)
 if I have earned it. I thank you for reading.

