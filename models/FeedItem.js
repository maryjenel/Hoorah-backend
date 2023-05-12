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

FeedItem.prototype.getFeed = async function() {
    try {
      const req =  await db.query('SELECT * FROM public.feeditem ORDER BY id ASC ', (error, results) => {
            
              console.log({req})
              if (error) {
                throw error

              }
        })
        return req
   
    } catch (error) {
        console.log({error})
        throw error;
    }
};
module.exports = FeedItem;