const FeedItem = require('../models/FeedItem');
const db = require('../db');

exports.postFeedItem = async (req, res, next) => {
    const {title, media} = req.body;
    try {
        const feedItem = new FeedItem({title, media});
        await feedItem.createFeedItem(feedItem);
        res.send(feedItem);
    } catch (error) {
        const errorToThrow = new Error();
        switch (error?.code) {
            case '23505':
                errorToThrow.message = 'FeedItem already exists';
                errorToThrow.statusCode = 403;
                break;
            default:
                errorToThrow.statusCode = 500;
        }
        next(errorToThrow);
    }
};

exports.getFeed = async  (request, response, next) => {
    try {
        await db.query('SELECT * FROM feeditem ORDER BY id ASC', (error, results) => {
           if (error) {
             throw error
           }
           response.status(200).json(results.rows)
         })
       } catch (error) {
           console.log({error})
           throw error;
       }
};