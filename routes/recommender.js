var express = require('express');
var router = express.Router();
var sw = require('stopword');
var client = require('../elasticdb');
var path = require('path');
var fs = require('fs');

var query = "";

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/setRecommendations', function(req, res, next) {
    var data = req.query.content;
    var tokens = data.match(/\w+/g);
    var settokens = new Set(tokens);
    tokens = Array.from(settokens);
    var newText = sw.removeStopwords(tokens);
    query = newText;
    res.status(200).send();
});

router.get('/getrecommendationspage', function(req, res, next) {
    var searchParams = {
        index: 'javaprogramming',
        size: 10,
        body: {
            query: {
                match: {
                    _all: query.join(' ')
                }
            }
        }
    };

    client.search(searchParams, function (err, result) {
        if (err) {
            // handle error
            console.log(err.message);
        }
        else{
            var results = result.hits.hits;

            res.render('../public/recommendations.ejs',{
                results: results
            });
            // var recommendationPage = path.join(__dirname, '..', 'public', 'recommendations.html');
            // var data = fs.readFileSync(recommendationPage, 'utf8');
            //
            // for (i = 0; i < 10; i++) {
            //     data = data.replace('$r'+(i+1).toString(),results[i]._source.content);
            // }
            // // res.send(data);
            // res.writeHead(200, { 'Content-Type': 'text/html' });
            // res.write(data);
            // res.end();

        }
    });
    // var recommendationPage = path.join(__dirname, '..', 'public', 'recommendations.html');
    // res.sendFile(recommendationPage);
    //
    // res.end('{"success" : "Updated Successfully", "status" : 200}');
    // // res.render('index', { title: 'Express' });
});

module.exports = router;
