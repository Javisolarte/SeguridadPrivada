// middlewares/verifyKeycloakToken.js
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
  jwksUri: "http://localhost:8080/realms/seguridad-api/protocol/openid-connect/certs",
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      console.error("Token invalid", err);
      return res.status(403).json({ message: "Invalid token" });
    }

    // Puedes guardar la info del token en el request
    req.user = decoded;
    next();
  });
};
