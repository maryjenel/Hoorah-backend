const FeedItem = require('../models/FeedItem');

exports.postFeedItem = async (req, res, next) => {
    //getting user data from request body
    console.log("RES", res)
    const {title, media} = req.query;
    try {
        console.log("RES", req)

        const feedItem = new FeedItem({title, media});
        console.log({feedItem})
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
        //pass error to next()
        next(errorToThrow);
    }
};