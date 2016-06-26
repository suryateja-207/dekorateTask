var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var collection = 'expenses';

var expenseSchema = new Schema({
    'name': String,
    'type': String,
    'price': Number,
    'date': {type: Date, default: Date.now}
});

module.exports = mongoose.model('Expense', expenseSchema, collection);
