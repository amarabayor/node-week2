const fs = require('fs');
const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
// FUNCTIONS
const getQuotesFunction = (req, res) => {
    let quotes = getQuotes();
    res.json(quotes);
};
const getQuoteByIdFunction = (req, res) => {
    let id = parseInt(req.params.id);
    let quotes = getQuotes();
    let quote = quotes.find(q => q.id == id);
    res.json(quote);
};
const postQuoteFunction = (req, res) => {
    // read all quotes from the quotes.json file
    // store all quotes in an array
    let rawdata = fs.readFileSync('quotes.json');
    let allQuotes = JSON.parse(rawdata);
    // retrieve the quote from the req body
    let newQuote = req.body;
    // assign a new id 
    let maxId = Math.max(...allQuotes.map(q => q.id));
    newQuote.id = maxId + 1;
    // add the new quote to the array
    allQuotes.push(newQuote);
    // save the whole array to the quotes.json file
    saveQuotes(allQuotes);
    res.send(newQuote);
};
const deleteQuoteFunction = (req, res) => {
    // find id that we want to delete. Get it from request parameters.
    let id = parseInt(req.params.id);
    // read quotes.json file and store in an array
    let allQuotes = getQuotes();
    // look for the quote that has the same id
    let quoteToDelete = allQuotes.find(quote => quote.id == id);
    // remove that quote from the array
    let index = allQuotes.indexOf(quoteToDelete);
    allQuotes.splice(index, 1);
    // save the array back to the json file.
    saveQuotes(allQuotes);
    res.send(quoteToDelete);
};
// AUX FUNCTIONS
const getQuotes = () => {
    // using global variable "fs" ^ defined at the top part of server.js
    let rawdata = fs.readFileSync('quotes.json');
    return JSON.parse(rawdata);
};
const saveQuotes = quotes => {
    let data = JSON.stringify(quotes);
    fs.writeFileSync('quotes.json', data);
};
// ENDPOINTS
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.get('/quotes', getQuotesFunction);
app.get('/quotes/:id', getQuoteByIdFunction);
app.post('/quotes', postQuoteFunction);
app.delete('/quotes/:id', deleteQuoteFunction);
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});