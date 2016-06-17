
function Runner() {
  if(!(this instanceof Runner)) return new Runner();
  this.routes = [];
}

Runner.prototype.use = function use(command, runner) {
  if(!runner) {
    runner = command;
    command = null;
  }
  this.routes.push({command, runner});
}

Runner.prototype.run = function run(options, callback) {
  options.originalPath = options.originalPath || options.path.slice(0);
  const command = options.path.shift();
  run(this.routes, options, function() {
    options.path.unshift(command);
    callback(...arguments);
  });
}

function process(routes, options, callback) {
  let routeIndex = 0;
  const next = (error) => {
    if(error) return callback(error);
    let route;
    while(route = routes[routeIndex++]) {
      if(isPathRoute(options.path[0], route.command)) break;      
    }
    if(!route) return callback(null);
    let level;
    if(command) level = options.path.shift();
    exec(route, options, function() {
      if(level) options.path.unshift(level);
      next(...arguments);
    });
  };
}

function isPathRoute(route, command) {
  if(!command) return true;
  if(typeof route === 'object') route = route.name;
  if(typeof command === 'object') command = command.name;
  return route === command;
}

function exec(runner, options, callback) {
  if(runner instanceof Runner) {
    runner.run(options, callback);
  } else {
    runner(options, callback);
  }
}

module.exports = Runner;

