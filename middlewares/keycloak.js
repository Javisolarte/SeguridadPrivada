const session = require('express-session');
const Keycloak = require('keycloak-connect');

// Configuración de la sesión (¡Keycloak la necesita!)
const memoryStore = new session.MemoryStore();

// Creamos la instancia de Keycloak
const keycloak = new Keycloak({ store: memoryStore }, {
    clientId: 'api-node',
    bearerOnly: true,
    serverUrl: 'http://localhost:8080/',
    realm: 'seguridad-api',
    credentials: {
      secret: '6YaDNgEfnQtlU56xBsQZ3U7v3vMFKrpL'
    }
});

module.exports = {
  memoryStore,
  keycloak
};
