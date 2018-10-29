const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const {accounts, users, writeJSON} = require('./data');

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => res.render('index', { title: 'Account Summary', accounts: accounts }));
app.get('/savings', (req, res) => res.render('account', { account: accounts.savings }));
app.get('/checking', (req, res) => res.render('account', { account: accounts.checking }));
app.get('/credit', (req, res) => res.render('account', { account: accounts.credit }));
app.get('/profile', (req, res) => res.render('profile', { user: users[0] }));
app.get('/transfer', (req, res) => res.render('transfer'));
app.get('/payment', (req, res) => res.render('payment', {account: accounts.credit}));
app.post('/payment', (req, res) => {

    let amount = parseInt(req.body.amount);
    let balance = parseInt(accounts.credit.balance);
    let avail = parseInt(accounts.credit.available);

    accounts.credit.balance = parseInt(balance - amount);
    accounts.credit.available = parseInt(avail + amount);

    writeJSON();
    
    res.render('payment', { message: "Payment Successful", account: accounts.credit });

});

app.post('/transfer', (req, res) => {
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


app.listen(3000, () => console.log('PS Project Running on port 3000!'));
