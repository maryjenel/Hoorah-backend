const axios = require('axios');

const db = require('../db');
//User constructor
function FeedItem ({
  fileName, 
  url, 
}) {
    this.fileName = fileName;
    this.url = url;
};
// add a createFeed method to the prototype
FeedItem.prototype.createFeedItem = async function(feedItem) {

    const { fileName, url } = feedItem;
    console.log('url in post feedItem = ' + url + ' and name = ' + fileName);
    try {
        const sqlText = "INSERT INTO feeditem(title, media) VALUES($1, $2)";
        const values = [fileName, url];
        const request = await db.query(sqlText, values);
        return request; 
    } catch (error) {
        console.log({error})
        throw error;
    }
};

module.exports = FeedItem;