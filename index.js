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
    const baseRequestURL = "https://api.iextrading.com/1.0";
    const buildEndpoint = "/stock/market/batch?symbols=aapl,fb&types=quote,news,chart&range=1m&last=5";
    let dataPromise = getData(baseRequestURL + buildEndpoint);
    dataPromise.then(JSON.parse, errHandler)
        .then(function (result) {
            userDetails = result;
            // console.log("Initialized user details");
            // let anotherPromise = getData(userDetails.followers_url)
            //     .then(JSON.parse);
            // return anotherPromise;
            return userDetails;
        }, errHandler)
        .then(function (data) {
            console.log(data)
            // console.log("gists: " + result.public_gists + "// public repos: " + result.public_repos)
        }, errHandler);
}

main();