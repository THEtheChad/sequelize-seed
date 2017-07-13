const fs = require('fs');
const path = require('path');
const Model = require('./model');

class Seeder {
  constructor() {
    this.models = {};
  }

  seed(queryInterface, rows = 5) {
    let models = this.models;
    for (let name in models) {
      let model = models[name];
      queryInterface.bulkInsert(model.table, model.seed(rows), {});
    }
  }

  _import(path) {
    let definition = require(path);
    let model = definition(Model, {});
    this.models[model.name] = model;
  }

  import(path) {
    let isDirectory = fs.lstatSync(path).isDirectory();

    if (!isDirectory) return this._import(path);

    fs
      .readdirSync(path)
      .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
      })
      .forEach(file => this._import(path.resolve(path, file)));
  }
}

module.exports = Seeder;