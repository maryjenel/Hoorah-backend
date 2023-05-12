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

        const sqlText = `INSERT INTO feeditem(title, media) VALUES($1, $2);`;
        const values = [title, media];
        const { rows } = await db.query(sqlText, values);
        return rows; 
    } catch (error) {
        throw error;
    }
};

module.exports = FeedItem;