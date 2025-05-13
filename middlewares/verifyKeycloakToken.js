const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
  jwksUri: "http://keycloak:8080/realms/seguridad_realm/protocol/openid-connect/certs",

});

// Convertimos getSigningKey (callback) a Promesa
function getKey(header) {
  return new Promise((resolve, reject) => {
    if (!header || !header.kid) {
      return reject(new Error("Invalid token header: Missing kid"));
    }

    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        console.error("Error retrieving signing key:", err);
        return reject(new Error("Failed to obtain signing key"));
      }

      const signingKey = key.getPublicKey();
      resolve(signingKey);
    });
  });
}

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedHeader = jwt.decode(token, { complete: true });

    if (!decodedHeader || !decodedHeader.header) {
      return res.status(400).json({ message: "Invalid token format" });
    }

    const publicKey = await getKey(decodedHeader.header);

    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token signature or malformed token" });
    }

    return res.status(403).json({ message: "Unauthorized: " + err.message });
  }
};
