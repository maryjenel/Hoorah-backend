const jwt = require("jsonwebtoken");

const tokenKey = process.env.TOKEN_KEY;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  jwt.verify(token, tokenKey, (err, decoded) => {
      if (err) return res.status(401).send({ message: 'Failed to authenticate.' });
      // check for > LIMIT requests in 1hr
      checkForRateLimit(decoded, next);
   });
};

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
            res.status(429).send({ message: 'Rate limit exceeded.' });
        } else { // valid path, proceed to the actual call with next() after resigning jwt token
                 // with new incremented requestCount
            jwt.sign(decoded, process.env.TOKEN_KEY);
            next();
        }
    }
}

module.exports = verifyToken; 