const express = require("express");
const utils = require('.././services/utils.js');
const api_svcs = require('.././services/api.js');
const config = require('../config.js');
const HashMap = require('hashmap');

const router = express.Router();

router.get("/", function (req, res) {
    console.log('-- API Services -- ');
    res.send('API Services');
});

router.get("/trends", function (req, res) {
    console.log('-- API Services | Trending Data -- ');
    var map = new HashMap();
    api_svcs.getTrends(60).then(function (results)  {
        if(results) {
            results[0].forEach(function (annotation, index)    {
                //console.log('Annotation ',annotation.ENTITY);
                if( map.get(annotation.ENTITY_TYPE) === undefined )  {
                    map.set(annotation.ENTITY_TYPE, 1);
                } else{
                    var tweetCount = map.get(annotation.ENTITY_TYPE);
                    map.set(annotation.ENTITY_TYPE, tweetCount+1)
                }
                
            });
        }
        res.send(map.entries());
    });
    
});

function responseAPISchema(map) {
    map.forEach(function (entry, index)  {

    })
}

module.exports = router
