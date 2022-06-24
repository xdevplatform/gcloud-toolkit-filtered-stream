const express = require("express");
const utils = require('../services/utils.js');
const api_svcs = require('../services/api.js');
const config = require('../config.js');
const { google } = require('googleapis');
const axios = require("axios").default;

const router = express.Router();

router.get("/", function (req, res) {
    console.log('-- Token Services -- ');
    generateAccessToken.apply().then((googSAToken) => {
        if (googSAToken) {
            listAPIKeys(googSAToken).then((apiKeys) => {
                res.send(apiKeys);
            })
        } else {
            res.send('Error fetching API Keys')
        }
    })
});

router.get("/APIKey", function (req, res) {
    console.log('-- Token Services /APIKey -- ', req.query.keyName);
    generateAccessToken().then((googSAToken) => {
        if (googSAToken) {
            getAPIKeyString(googSAToken, req.query.keyName).then((apiKey) => {
                res.send(apiKey);
            });
        }else{
            res.send('Error in fetching API Key for ',req.body.keyName)
        }
    })

});

router.post("/APIKey", function (req, res) {
    console.log('-- Token Services Create/APIKey -- ',req.body.displayName);
    createAPIKey(req.body.displayName).then((keyData) => {
        res.send(keyData);
    }).catch(function (error) {
        console.log(error);
        res.send('Error in generating access token');
    });

});

async function generateAccessToken() {
    const auth = new google.auth.GoogleAuth({
        keyFile: __dirname + '../../service-account.json',
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    const accessToken = await auth.getAccessToken()
    //console.log('Access Token - ', accessToken)
    return accessToken;
}

async function createAPIKey(displayName) {
    generateAccessToken().then((googSAToken) => {
        let axiosConfig = {
            headers: { Authorization: 'Bearer ' + googSAToken, 'Content-Type': 'application/json' }
        };
        let bodyParameters = {
            "displayName": displayName
        }
        axios.post(
            config.apiKeyMgmt.key_endpoint.url,
            bodyParameters,
            axiosConfig
        ).then(function (apiKeyObj) {
            console.log('apiKeyObj ', apiKeyObj.data);
            return apiKeyObj.data;
        })
    }).catch(function (error) {
        console.log('createAPIKey ', error);
    })
}

async function listAPIKeys(accessToken) {
    return new Promise(function (resolve, reject) {
        let axiosConfig = {
            headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' }
        };
        axios.get(
            config.apiKeyMgmt.key_endpoint.url,
            axiosConfig
        ).then(function (apiKeys) {
            console.log('apiKeys ', apiKeys.data);
            resolve(apiKeys.data);
        }).catch(function (error) {
            console.log('Error fetching API keys')
            reject('Error fetching API keys');
        })

    });
}

async function getAPIKeyString(googSAToken, keyName) {
    return new Promise(function (resolve, reject) {
        let axiosConfig = {
            headers: { Authorization: 'Bearer ' + googSAToken, 'Content-Type': 'application/json' }
        };
        axios.get(
            config.apiKeyMgmt.domain_url + keyName + '/keyString',
            axiosConfig
        ).then(function (apiKeys) {
            console.log('getAPIKeyString ', apiKeys.data)
            resolve(apiKeys.data);
        })
    }).catch(function (error) {
        console.log('getAPIKeyString ', error);
        reject('Error in accessing API Key')
    })
}

module.exports = router
