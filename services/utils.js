function sleep(milliseconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('timed');
        }, milliseconds)
    })
}

function getTrends(tableName, minutes) {
    return `SELECT
    context.domain.name as CONTEXT, entity.normalized_text as ENTITY, entity.type as ENTITY_TYPE,
    COUNT(*) AS TWEET_COUNT
  FROM `+ tableName + ` AS GT,
    UNNEST(context_annotations) AS context,
    UNNEST(entities.annotations) AS entity
where created_at > DATETIME_SUB(current_datetime(), INTERVAL `+ minutes + ` MINUTE) 
  GROUP BY
     ENTITY, ENTITY_TYPE, CONTEXT
  ORDER BY
    TWEET_COUNT DESC`;
}

module.exports = { sleep, getTrends };