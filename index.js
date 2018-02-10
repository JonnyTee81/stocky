const request = require('request');

// API GET METHOD
// Referencing article on Medium
// Title: Writing neat asynchronous Node JS code with Promises
// URL: https://medium.com/dev-bits/writing-neat-asynchronous-node-js-code-with-promises-32ed3a4fd098

let userDetails;

function getData(url) {
    // Set URL and headers for request
    let options = {
        url: url,
        headers: {
            'User-Agent': 'request'
        }
    };

    // Return new promise
    return new Promise(function (resolve, reject) {
        // Async Job
        request.get(options, function (err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })
}

let errHandler = function (err) {
    console.log(err);
}

function main() {
    const symbol = 'FB';
    const historicalTimeframe = '1m'; //eg. 1m, 3m, 6m, 1y, 2y, 5y
    const investmentShares = 1; // Number of shares bought
    let benchmark = 0; // Initial value of purchase

    const baseRequestURL = "https://api.iextrading.com/1.0";
    // const buildEndpoint = "/stock/market/batch?symbols=aapl,fb&types=quote,news,chart&range=1m&last=5";
    const buildEndpoint = `/stock/${symbol}/chart/${historicalTimeframe}`;
    // const buildEndpoint = `/stock/${symbol}/batch`;
    let dataPromise = getData(baseRequestURL + buildEndpoint);
    dataPromise.then(JSON.parse, errHandler)
        .then((data) => {
            let closePrices = data.map(x => x.close);
            // console.log(closePrices);
            return closePrices;
        }, errHandler)
        .then((data) => {
            benchmark = data[0]*investmentShares;
            let closeValue = data.map(x => {
                return ((x*investmentShares) - benchmark).toFixed(2);
            });
            console.log(closeValue);
        }, errHandler);
}

main();