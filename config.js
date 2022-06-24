var config = {};

config.PORT = 4060;

config.twitter_bearer_token = 'Bearer <<YOUR_TOKEN>>'

config.filtered_stream = {
    "host" : 'https://api.twitter.com',
    "path" : '/2/tweets/search/stream?',
    "tweet_fields" : 'tweet.fields=attachments,author_id,context_annotations,conversation_id,created_at,entities,geo,id,in_reply_to_user_id,lang,public_metrics,possibly_sensitive,referenced_tweets,reply_settings,source,text,withheld&',
    "user_fields" : 'user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld&',
    "expansions" : 'expansions=attachments.poll_ids,attachments.media_keys,author_id,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id&',
    "media_fields" : 'media.fields=duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics,alt_text&',
    "place_fields" : 'place.fields=contained_within,country,country_code,full_name,geo,id,name,place_type&',
    "poll_fields" : 'poll.fields=duration_minutes,end_datetime,id,options,voting_status'
}

config.filtered_stream.rules = {
    "api" : 'https://api.twitter.com/2/tweets/search/stream/rules'
}

config.gcp_infra = {
    "projectId" : "twttr-des-sa-demo-dev",
    "topicName" : "fs-crypto",
    "subscriptionName" : "fs-crypto-sub",
    "messageCount" : 100
}
config.gcp_infra.bq = {
    "dataSetId": "fs_trends"
}
config.gcp_infra.bq.table = {
    "tweets": "tweets",
    "users": "users"
}

config.reconnectCounter = 3

config.apiKeyMgmt = {
    "domain_url" : "https://apikeys.googleapis.com/v2/"
}

config.apiKeyMgmt.key_endpoint = {
    "url" : config.apiKeyMgmt.domain_url+"projects/"+config.gcp_infra.projectId+"/locations/global/keys"
}


module.exports = config;
