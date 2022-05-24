const express = require("express");
const gcp_infra_svcs = require('.././services/gcp-infra.js');
const config = require('../config.js');
const axios = require("axios").default;

const router = express.Router();

router.post("/", function (req, res) {
    let axiosConfig = {
        method: 'post',
        url: config.filtered_stream.rules.api,
        headers: { 'Authorization': config.twitter_bearer_token },
        data: req.body
    };
    console.log('Rules: Request body ',req.body);
    axios(axiosConfig)
        .then(function (response) {
            if(response.data.errors)
            res.json(response.data.errors);    
            res.json(response.data.data);
        })
        .catch(function (error) {
            console.log(error);
            res.send(error);
        });
});

router.get("/", function (req, res) {
    var rulesData;
    let axiosConfig = {
        method: 'get',
        url: config.filtered_stream.rules.api,
        headers: { 'Authorization': config.twitter_bearer_token }
    };

    axios(axiosConfig)
        .then(function (response) {
            rulesData = response.data.data;
            if( rulesData === undefined)    {
                rulesData = [];
            }
            res.send(rulesData);
        })
        .catch(function (error) {
            console.log(error);
        });
});

module.exports = router
