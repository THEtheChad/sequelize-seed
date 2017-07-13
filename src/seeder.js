const fs = require('fs');
const path = require('path');
const Model = require('./model');

class Seeder {
  constructor() {
    this.models = {};
  }

  seed(queryInterface, rows = 5) {
    let models = this.models;
    let operations = [];
    for (let name in models) {
      let model = models[name];
      let query = queryInterface.bulkInsert(model.table, model.seed(rows), {});
      operations.push(query);
    }
    return Promise.all(operations);
  }

  _import(path_str) {
    let definition = require(path_str);
    let model = definition(Model, {
      DATE: 'date',
      STRING: 'lorem',
      CHAR: 'lorem',
      TEXT: 'lorem',
      INTEGER: 'integer',
      BIGINT: 'integer',
      FLOAT: 'decimal',
      TIME: 'time',
      DATEONLY: 'date',
      BOOLEAN: 'boolean',
      BLOB: 'blob',
      DECIMAL: 'decimal',
      UUID: 'id',
      ENUM: 'enum',
      REAL: 'integer',
      DOUBLE: 'integer'
    });
    this.models[model.name] = model;
  }

  import(path_str) {
    let isDirectory = fs.lstatSync(path_str).isDirectory();

    if (!isDirectory) return this._import(path_str);

    fs
      .readdirSync(path_str)
      .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
      })
      .forEach(file => this._import(path.resolve(path_str, file)));

    return this;
  }
}

module.exports = Seeder;