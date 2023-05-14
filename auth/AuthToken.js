const jwt = require("jsonwebtoken");

const tokenKey = process.env.TOKEN_KEY;

/**
 * Function to verify a token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const verifyToken = (req, res, next) => {
  // get the token from body / url or header
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  // fail request if no token available
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  // verify the token, return 401 if invalid, otherwise check for rate limits
  jwt.verify(token, tokenKey, (err, decoded) => {
      if (err) return res.status(401).send({ message: 'Failed to authenticate.' });
      // check for > LIMIT requests in 1hr
      checkForRateLimit(decoded, next);
   });
};

/**
 * Function to check rate limits for given requester
 * @param {*} decoded 
 * @param {*} next 
 * @param {*} limit 
 */
const checkForRateLimit = (decoded, next, limit = 1000) => {
    // check for > 1000 requests in 1hr
    const currentTime = Date.now();
    const timeElapsed = currentTime - decoded.issuedAt;
    const hourInMillis = 1000 * 60 * 60;
    // if its been longer than 1hr, reset request count, update issuedAt to now
    if (timeElapsed > hourInMillis) {
        decoded.requestCount = 1;
        decoded.issuedAt = currentTime;
    } else { // its been less than 1hr, check for more requests
        decoded.requestCount++;
        if (decoded.requestCount > limit) {
            return res.status(429).send({ message: 'Rate limit exceeded.' });
        }
    }
     // with new incremented requestCount
     jwt.sign(decoded, process.env.TOKEN_KEY);
     next(); // instructs the call to continue call chain
}

module.exports = verifyToken; 