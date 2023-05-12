const db = require('../db');
//User constructor
function FeedItem ({
  title, 
  media, 
}) {
    this.title = title;
    this.media = media;
};
// add a createFeed method to the prototype
FeedItem.prototype.createFeedItem = async function({ title, 
    media }) {
    try {
        const sqlText = "INSERT INTO feeditem(title, media) VALUES($1, $2)";
        const values = [title, media];
        const request = await db.query(sqlText, values);
        return request; 
    } catch (error) {
        console.log({error})
        throw error;
    }
};

module.exports = FeedItem;