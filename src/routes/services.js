const express = require('express');
const router = express.Router();

const {accounts, writeJSON} = require('../data');

router.get('/transfer', (req, res) => res.render('transfer'));
router.get('/payment', (req, res) => res.render('payment', {account: accounts.credit}));
router.post('/payment', (req, res) => {

    let amount = parseInt(req.body.amount);
    let balance = parseInt(accounts.credit.balance);
    let avail = parseInt(accounts.credit.available);

    accounts.credit.balance = parseInt(balance - amount);
    accounts.credit.available = parseInt(avail + amount);

    writeJSON();
    
    res.render('payment', { message: "Payment Successful", account: accounts.credit });

});

router.post('/transfer', (req, res) => {
    let fromAccount = req.body.from;
    let toAccount = req.body.to;
    let amount = req.body.amount;

    let currentFrom = parseInt(accounts[fromAccount].balance);
    let currentTo = parseInt(accounts[toAccount].balance);

    currentFrom -= parseInt(amount);
    currentTo += parseInt(amount);
    accounts[toAccount].balance = currentTo
    accounts[fromAccount].balance = currentFrom;

    writeJSON();

    res.render('transfer', {message: "Transfer Completed"});
}
);

module.exports = router;
