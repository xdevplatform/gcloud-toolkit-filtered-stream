const express = require("express");
const gcp_infra_svcs = require('.././services/gcp-infra.js');
const config = require('../config.js');
const needle = require('needle');

const router = express.Router();

router.get("/", function (req, res) {
    gcp_infra_svcs.provisionDB().then(function (status) {
        if (status != null && status.includes('Successfully provisioned')) {
            gcp_infra_svcs.setupMsgInfra().then(function (statusMsg)    {
                if (statusMsg != null && statusMsg.includes(config.gcp_infra.topicName)) {
                    streamTweets();
                }        
            })
            res.send("Now streaming tweets with new GCP infra ..");
        }

    }).catch(error => {
        streamTweets();
        res.send("Now streaming tweets with existing GCP infra ..");
    })
});

router.get("/clean", function (req, res) {
    gcp_infra_svcs.cleanUp();
    res.send('GCP resources deleted');
});

router.get("/connect", function (req, res) {
    streamTweets();
    res.send('Connecting to stream');
  });

router.get("/alive", function (req, res) {
    //console.log('staying alive ..');
    res.send('Alive');
});

router.get("/poll/:frequency/:delay", function (req, res) {
    console.log('polling Tweets from PubSub ', req.params.frequency);
    for (var i = 0; i < req.params.frequency; i++) {
        setTimeout(() => {
            gcp_infra_svcs.synchronousPull(config.gcp_infra.projectId, config.gcp_infra.subscriptionName, config.gcp_infra.messageCount).then((messenger) => {

                if (messenger === 'disconnect') {
                    console.log('Stream reconnecting => ', messenger);
                    streamTweets();
                }
            })

        }, req.params.delay);
    }
    res.send('polling Tweets from PubSub');
});

async function streamTweets() {
    console.log('Streaming Tweets ..')
    //Listen to the stream
    const options = {
        timeout: 20000
    }

    const streamURL = config.filtered_stream.host + config.filtered_stream.path + config.filtered_stream.tweet_fields + 
    config.filtered_stream.user_fields + config.filtered_stream.expansions + config.filtered_stream.media_fields + config.filtered_stream.place_fields + 
    config.filtered_stream.poll_fields;

    const stream = needle.get(streamURL, {
        headers: {
            Authorization: config.twitter_bearer_token
        }
    }, options);

    stream.on('data', data => {
        var splited_payload = '';
        try {
            const json_payload = data.toString();
            console.log('Received Tweet ',json_payload.substring(39,45));
            if (json_payload) {
                try {
                    JSON.parse(json_payload);
                    gcp_infra_svcs.publishMessage(config.gcp_infra.topicName, JSON.stringify(json_payload));
                } catch (e) {
                    if (json_payload[0] === undefined || json_payload[0] === '\r' || json_payload[0] === '' || json_payload[0] === '\n') {
                        console.log('~~~ Heartbeat payload ~~~ ');
                    } else {
                        if (splited_payload.length > 0) {
                            splited_payload.append(json_payload);
                            gcp_infra_svcs.publishMessage(config.gcp_infra.topicName, JSON.stringify(splited_payload));
                            console.log('splited_payload ', JSON.parse(splited_payload));
                            splited_payload = '';
                        }
                        else
                            splited_payload = json_payload;
                    }
                }
            }
        } catch (e) {
            console.log('Error ', e);
            // Keep alive signal received. Do nothing.
        }
    }).on('error', error => {
        if (error.code === 'ETIMEDOUT') {
            stream.emit('timeout');
        }
    });

    return stream;

}

module.exports = router
module.exports.streamTweets = streamTweets;
