const { BigQuery } = require("@google-cloud/bigquery");
const config = require('../config.js');
const utils = require('./utils.js');

async function getTrends(minutes) {

    return new Promise(function (resolve, reject) {

        const bigqueryClient = new BigQuery();
        let tableName = config.gcp_infra.bq.dataSetId + '.' + config.gcp_infra.bq.table.tweets;
        console.log('getTrends SQL ', utils.getTrends(tableName, minutes));
        const options = {
            query: utils.getTrends(tableName, minutes),
            location: 'US',
        };

        //const [rows] = await bigqueryClient.query(options);
        bigqueryClient.query(options).then(function (rows)   {
            resolve(rows);
        }).catch(function (error)   {
            reject(error);
        })
        //console.log('Query Results: ', rows.length);
        //return rows;
        //resolve(rows)

    })

}

module.exports = { getTrends };