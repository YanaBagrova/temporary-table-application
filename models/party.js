'use strict';
const {
  Model
} = require('sequelize');
const Temporal = require('sequelize-temporal');
module.exports = (sequelize, DataTypes) => {
  class Party extends Model {
    static associate({Contract}) {
      this.hasMany(Contract, { foreignKey: 'partyId' });
    }
  }
  Party.init({
    lastName: DataTypes.TEXT,
    firstName: DataTypes.TEXT,
    birthDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Party',
  });
  Temporal(Party, sequelize)
  return Party;
};
