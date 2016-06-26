var express = require('express');
var router = express.Router();
var Expense = require('./models/Expense');
var mongoose = require('mongoose');

var expensesGETController = function (req, res) {
    Expense.find().lean().exec(function (err, expense) {
        if (err) {
            console.log(err);
            res.status(500).json({error: err.message});
        }
        else {
            res.status(200).json(expense);
        }
    });
};

var expensesPOSTController = function (req, res) {
    var body = req.body;
    var expense = new Expense();
    console.log(body);
    expense.name = body.name;
    expense.type = body.type;
    expense.price = body.price;
    expense.date = body.date || new Date();
    expense.save(function (err, expense) {
        if (err) {
            console.log(err);
            res.status(500).json({error: err.message});
        }
        else {
            res.status(200).json(expense);
        }
    });
};

var expensesDELETEController = function (req, res) {
    var body = req.body;
    var id = body.id;
    console.log(id);
    Expense.findOne({_id: mongoose.Types.ObjectId(id)}).remove().exec(function(err){
        if(err) {
            console.log(err);
            res.status(500).json({error: err.message});
        }
        else {
            res.status(200).send({code: true});
        }
    });
};

router.route('/expenses').get(expensesGETController);
router.route('/expenses').post(expensesPOSTController);
router.route('/expenses').delete(expensesDELETEController);

module.exports = router;