const jwt = require("jsonwebtoken");

const tokenKey = process.env.TOKEN_KEY;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  jwt.verify(token, tokenKey, function(err, decoded) {
      if (err) return res.status(401).send({ message: 'Failed to authenticate.' });
      // check for > 1000 requests in 1hr
      const currentTime = Date.now();
      const timeElapsed = currentTime - decoded.issuedAt;
      const hourInMillis = 1000 * 60 * 60;
      // reset request count, update issuedAt to now
      if (timeElapsed > hourInMillis) {
        decoded.requestCount = 1;
        decoded.issuedAt = currentTime;
      } else {
        decoded.requestCount++;
        if (decoded.requestCount > 1000) {
            res.status(429).send({ message: 'Rate limit exceeded.' });
        } else {
            // resign token, proceed to next step
            jwt.sign(decoded, process.env.TOKEN_KEY);
            next();
        }
      }
    });

};

module.exports = verifyToken; 