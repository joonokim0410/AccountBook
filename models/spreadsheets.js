/**
 * Created by john on 2016-11-09.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Spreadsheet = sequelize.define('Spreadsheet', {
        id: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
        sheetId: {type: DataTypes.INTEGER, allowNull: false},
        name: {type: DataTypes.STRING, allowNull: false},
    });

    return Spreadsheet;
};