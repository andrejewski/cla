
const fs = require('fs');

function primitive(constructor, useNew) {
  return {
    type: 'type',
    name: constructor.name,
    defaultValue: constructor(),
    argCount: 1,
    value(x) {
      return useNew ? new constructor(x) : constructor(x);
    }
  };
}

function fsEntry(name) {
  return {
    type: 'type',
    name: name,
    defaultValue: void 0,
    argCount: 1,
    value(path) {
      const stats = fs.statSync(path);
      if(!stats[`is${name}`]()) {
        throw new Error(`"${path}" is not a ${name}`);
      }
      return path;
    },
  }
}

const primitives = [Number, String, Boolean, Date]
  .reduce((types, constructor) => {
    const useNew = constructor === Date;
    types[constructor.name] = primitive(constructor, useNew);
    return types;
  }, {});

const fsEntries = ['File', 'Directory', 'BlockDevice', 'CharacterDevice', 'FIFO', 'Socket']
  .reduce((types, entryType) => {
    types[entryType] = fsEntry(entryType);
    return types;
  });

function Empty(value) {
  return {
    type: 'type',
    name: 'Empty',
    defaultValue: void 0,
    argCount: 0,
    value() {
      return value;
    }
  };
}

const Json = {
  type: 'type',
  name: 'Json',
  defaultValue: void 0,
  argCount: 1,
  value(json) {
    return JSON.parse(json);
  }
};

function List(type, count) {
  return {
    type: 'type',
    name: `List<${type.name}>`,
    defaultValue: [],
    argCount: count,
    value(...values) {
      return values.map(type.value);
    }
  }
}

function Tuple(...types) {
  const name = `Tuple<${types.map(t => t.name).join(',')}>`;
  return {
    type: 'type',
    name,
    defaultValue: types.map(t => t.defaultValue),
    argCount: types.length,
    value(...values) {
      return values.map((value, index) => types[index].value(value));
    }
  }
}

const YesNo = {
  type: 'type',
  name: 'yesno',
  defaultValue: false,
  argCount: 1,
  value(x) {
    return x.startsWith('y');
  }
};

module.exports = Object.assign(primitives, fsEntries, {
  Empty,
  Json,
  List,
  Tuple,
  YesNo
});

