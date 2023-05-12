const FeedItem = require('../models/FeedItem');

exports.postFeedItem = async (req, res, next) => {

    const {title, media} = req.query;
    try {
        const feedItem = new FeedItem({title, media});
        await feedItem.createFeedItem({title,media});
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

exports.getFeed = async (req, res, next) => {

    const {title, media} = req.query;
    try {
        const feedItem = new FeedItem({title, media});
        await feedItem.getFeed();
        res.send(feedItem);
    } catch (error) {
        console.log(`Error code: ${error?.code}`, error)
  
    }
};