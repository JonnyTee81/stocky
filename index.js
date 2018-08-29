const request = require('request');

// Global variables
let userDetails;
const TIMEFRAME = "1m"; //eg. 1m, 3m, 6m, 1y, 2y, 5y
const PORTFOLIO = [
  {
    symbol: "FB",
    shares: 2
  },
  {
    symbol: "AAPL",
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
  
    let symbols = [];
    let finalPortfolioValue =[];
    
    // Loop through all investments in portfolio
    portfolio.forEach(element => {
        symbols.push(investmentValueArrayForSymbol(element.symbol, TIMEFRAME, element.shares));
    });

    let finVals = Promise.all(symbols);
    finVals.then(function(value){
            // Loop through days
            for(let i=0;i<value[0].length;i++){
                let sumStocks = 0; 
                // Add all the stocks together for that day  
                for(let j=0;j<symbols.length;j++){
                    sumStocks += Number(value[j][i]);
                }
                // Add all the stock values together and add to array
                finalPortfolioValue.push(sumStocks.toFixed(2));
            }
            console.log(finalPortfolioValue);
        })
        .catch(function(value){
            console.log(value);
        });
}

investmentPortfolioValue(PORTFOLIO);