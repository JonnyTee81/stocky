const request = require('request');

// Global variables
let userDetails;
const historicalTimeframe = "1m"; //eg. 1m, 3m, 6m, 1y, 2y, 5y
const portfolio = [
  {
    symbol: "FB",
    shares: 2
  }
];

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
    console.error(err);
}

function investmentValueArrayForSymbol(symbol, historicalTimeframe, investmentShares) {
    let benchmark = 0; // Initial value of purchase
    let valArray = [];
    // let symbol = "FB";

    const baseRequestURL = "https://api.iextrading.com/1.0";
    const buildEndpoint = `/stock/${symbol}/chart/${historicalTimeframe}`;
    let dataPromise = getData(baseRequestURL + buildEndpoint);
    return dataPromise
      .then(JSON.parse, errHandler)
      .then(data => {
        let closePrices = data.map(x => x.close);
        return closePrices;
      }, errHandler)
      .then(data => {
        benchmark = data[0] * investmentShares;
        let closeValue = data.map(x => {
          return (x * investmentShares - benchmark).toFixed(2);
        });
        return closeValue;
      }, errHandler)
      .catch(function(err) {
        console.error(err);
    });
}

function investmentPortfolioValue(portfolio) {
  
    let finalPortfolioValue =[];
  // Loop through all investments in portfolio

    // Get Values of all symbols
    let sym01 = investmentValueArrayForSymbol("aapl", historicalTimeframe, 2);
    let sym02 = investmentValueArrayForSymbol("FB", historicalTimeframe, 2);

    // console.log(sym01);
    let finVals = Promise.all([sym01, sym02]);
    finVals.then(function(value){
        // console.log(value[0]);
        // console.log(value[1]);
        for(let i=0;i<value[0].length;i++){
            finalPortfolioValue.push((Number(value[0][i]) + Number(value[1][i])).toFixed(2));
        }
        console.log(finalPortfolioValue);
    })
        .catch(function(value){
            console.log(value);
        });
}

investmentPortfolioValue(portfolio);