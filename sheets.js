/**
 * Created by john on 2016-11-09.
 */

// use the libraries to create and update our spreadsheets.
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var util = require('util');

var SheetsHelper = function (accessToken) {
    var authClient = new googleAuth();
    var auth = new authClient.OAuth2();
    auth.credentials = {
        access_token: accessToken
    };
    this.service = google.sheets({version: 'v4', auth: auth});
};

module.exports = SheetsHelper;

// method for creating a spreadsheet.
SheetsHelper.prototype.createSpreadsheet = function (title, callback) {
    var self = this;
    var request = {
        resource: {
            properties: {
                title: title
            },
            sheets: [
                {
                    properties: {
                        title: 'Data',
                        gridProperties: {
                            columnCount: 5,
                            frozenRowCount: 1
                        }
                    }
                },
                // TODO: Add more sheets.
            ]
        }
    };
    self.service.spreadsheets.create(request, function (err, spreadsheet) {
        if (err) {
            return callback(err);
        }
        // TODO: Add header rows.
        //return callback(null, spreadsheet);

        var dataSheetId = spreadsheet.sheets[0].properties.sheetId;
        var requests = [
            buildHeaderRowRequest(dataSheetId),
        ];
        // TODO: Add pivot table and chart.
        var request = {
            spreadsheetId: spreadsheet.spreadsheetId,
            resource: {
                requests: requests
            }
        };
        self.service.spreadsheets.batchUpdate(request, function (err, response) {
            if (err) {
                return callback(err);
            }
            return callback(null, spreadsheet);
        });
    });
};
//define the column headers
// var COLUMNS = [
//     { field: 'id', header: 'ID' },
//     { field: 'customerName', header: 'Usage Detail'},
//     { field: 'productCode', header: 'Usage Place' },
//     //{ field: 'unitsOrdered', header: 'Units Ordered' },
//     { field: 'unitPrice', header: 'Usage Price' },
//     { field: 'status', header: 'Status'}
//   ];
var COLUMNS = [
    { field: 'date', header: '날짜' },
    { field: 'usageHistory', header: '내역'},
    { field: 'usageDetail', header: '내역 상세' },
    //{ field: 'unitsOrdered', header: 'Units Ordered' },
    { field: 'usagePrice', header: '금액' },
    { field: 'status', header: '구분'}
  ];



/**
 * Builds a request that sets the header row.
 * @param  {string} sheetId The ID of the sheet.
 * @return {Object}         The reqeuest.
 */
function buildHeaderRowRequest(sheetId) {
    var cells = COLUMNS.map(function(column) {
        return {
            userEnteredValue: {
                stringValue: column.header
            },
            userEnteredFormat: {
                textFormat: {
                    bold: true
                }
            }
        }
    });
    return {
        updateCells: {
            start: {
                sheetId: sheetId,
                rowIndex: 0,
                columnIndex: 0
            },
            rows: [
                {
                    values: cells
                }
            ],
            fields: 'userEnteredValue,userEnteredFormat.textFormat.bold'
        }
    };
}
/**
 * Sync the orders to a spreadsheet.
 * @param  {string}   spreadsheetId The ID of the spreadsheet.
 * @param  {string}   sheetId       The ID of the sheet.
 * @param  {Array}    orders        The list of orders.
 * @param  {Function} callback      The callback function.
 */
SheetsHelper.prototype.sync = function(spreadsheetId, sheetId, orders, callback) {
    var requests = [];
    // Resize the sheet.
    requests.push({
        updateSheetProperties: {
            properties: {
                sheetId: sheetId,
                gridProperties: {
                    rowCount: orders.length + 1,
                    columnCount: COLUMNS.length
                }
            },
            fields: 'gridProperties(rowCount,columnCount)'
        }
    });
    // Set the cell values.
    requests.push({
        updateCells: {
            start: {
                sheetId: sheetId,
                rowIndex: 1,
                columnIndex: 0
            },
            rows: buildRowsForOrders(orders),
            fields: '*'
        }
    });
    // Send the batchUpdate request.
    var request = {
        spreadsheetId: spreadsheetId,
        resource: {
            requests: requests
        }
    };
    this.service.spreadsheets.batchUpdate(request, function(err) {
        if (err) {
            return callback(err);
        }
        return callback();
    });
};

/**
 * Builds an array of RowData from the orders provided.
 * @param  {Array} orders The orders.
 * @return {Array}        The RowData.
 */
function buildRowsForOrders(orders) {
    return orders.map(function(order) {
        var cells = COLUMNS.map(function(column) {
            switch (column.field) {
                // case 'unitsOrdered':
                //     return {
                //        userEnteredValue: {
                //            numberValue: order.unitsOrdered
                //        },
                //        userEnteredFormat: {
                //            numberFormat: {
                //                type: 'NUMBER',
                //                pattern: '#,##0'
                //            }
                //        }
                //     };
                //     break;
                case 'usagePrice':
                    return {
                        userEnteredValue: {
                            numberValue: order.usagePrice
                        },
                        userEnteredFormat: {
                            numberFormat: {
                                type: 'CURRENCY',
                                pattern: '#,## "원"'
                            }
                        }
                    };
                    break;
                case 'status':
                    return {
                        userEnteredValue: {
                            stringValue: order.status
                        },
                        dataValidation: {
                            condition: {
                                type: 'ONE_OF_LIST',
                                values: [
                                    { userEnteredValue: '수입' },
                                    { userEnteredValue: '지출' },
                                    { userEnteredValue: '기타' }
                                    // { userEnteredValue: 'INCOME' },
                                    // { userEnteredValue: 'SPEND' },
                                    // { userEnteredValue: 'OTHER' }
                                ]
                            },
                            strict: true,
                            showCustomUi: true
                        }
                    };
                    break;
                default:
                    return {
                        userEnteredValue: {
                            stringValue: order[column.field].toString()
                        }
                    };
            }
        });
        return {
            values: cells
        };
    });
}
