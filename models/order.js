/*
  Copyright 2016 Google, Inc.

  Licensed to the Apache Software Foundation (ASF) under one or more contributor
  license agreements. See the NOTICE file distributed with this work for
  additional information regarding copyright ownership. The ASF licenses this
  file to you under the Apache License, Version 2.0 (the "License"); you may not
  use this file except in compliance with the License. You may obtain a copy of
  the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
  License for the specific language governing permissions and limitations under
  the License.
*/

"use strict";

module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define('Order', {
    usageHistory: {type: DataTypes.STRING, allowNull: false},
    usageDetail: {type: DataTypes.STRING, allowNull: false},
    // unitsOrdered: {type: DataTypes.INTEGER, allowNull: false},
    usagePrice: {type: DataTypes.FLOAT, allowNull: false},
    //status: {type: DataTypes.STRING, allowNull: false, defaultValue: 'INCOME'}
    status: {type: DataTypes.TEXT, allowNull: false, defaultValue: 'INCOME'}

    // customerName: {type: DataTypes.STRING, allowNull: false},
    // productCode: {type: DataTypes.STRING, allowNull: false},
    // unitsOrdered: {type: DataTypes.INTEGER, allowNull: false},
    // unitPrice: {type: DataTypes.FLOAT, allowNull: false},
    // //status: {type: DataTypes.STRING, allowNull: false, defaultValue: 'INCOME'}
    // status: {type: DataTypes.TEXT, allowNull: false, defaultValue: '수입'}
  });

  return Order;
};
