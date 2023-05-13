const db = require('../db');
//User constructor
function FeedItem ({
  id,
  title, 
  media, 
}) {
    this.id = id;
    this.title = title;
    this.media = media;
};
// add a createFeed method to the prototype
FeedItem.prototype.createFeedItem = async function(feedItem) {
    const { id, title, media } = feedItem;
    try {
        const sqlText = "INSERT INTO feeditem(id, title, media) VALUES($1, $2, $3)";
        const values = [id, title, media];
        const request = await db.query(sqlText, values);
        return request; 
    } catch (error) {
        console.log({error})
        throw error;
    }
};

module.exports = FeedItem;