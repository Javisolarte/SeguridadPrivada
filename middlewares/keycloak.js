const session = require('express-session');
const Keycloak = require('keycloak-connect');
const fs = require('fs');

// Leer configuración desde keycloak.json
const keycloakConfig = JSON.parse(fs.readFileSync('./keycloak.json'));

// Crear store de sesión en memoria (requerido por Keycloak)
const memoryStore = new session.MemoryStore();

// Creamos la instancia de Keycloak
const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

module.exports = {
  memoryStore,
  keycloak
};
