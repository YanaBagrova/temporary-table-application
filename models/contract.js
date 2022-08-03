'use strict';
const {
  Model
} = require('sequelize');
const Temporal = require('sequelize-temporal');
module.exports = (sequelize, DataTypes) => {
  class Contract extends Model {
    static associate({Party}) {
      this.belongsTo(Party, { foreignKey: 'partyId' });
    }
  }
  Contract.init({
    documentId: DataTypes.TEXT,
    type: DataTypes.TEXT,
    partyId: DataTypes.INTEGER,
    documentNumber: DataTypes.TEXT,
    productCode: DataTypes.TEXT,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    term: DataTypes.INTEGER,
    policyYearNum: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Contract',
  });
  Temporal(Contract, sequelize)
  return Contract;
};
