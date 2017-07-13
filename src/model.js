const specious = require('specious');

class Model {
  constructor(name, attrs, opts) {
    this.name = name;
    this.attrs = attrs;
    this.opts = opts;

    let fields = this.fields = {};
    this.table = opts.tableName || name;

    for (let alias in attrs) {
      let def = attrs[alias];
      fields[def.field] = {
        alias,
        type: def.type,
        seed: def.seed
      }
    }
  }

  seed(rows = 5) {
    let defs = this.fields;
    let fields = Object.keys(defs);
    let records = [];

    do {
      let record = {};
      fields.forEach(field => {
        let def = defs[field];

        let [m, predicate, params] = /([^(]+)\(([^)]+)\)/.exec(def.seed);
        params = params.split(',');

        record[field] = specious.create(predicate, params);
      });
      records.push(record);
    }
    while (rows--);

    return rows ? records : records[0];
  }

  static define(name, attrs, opts) {
    return new Model(name, attrs, opts);
  }
}

module.exports = Model;