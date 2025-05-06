const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API de Gestión de Horarios de Seguridad",
    version: "1.0.0",
    description: "Documentación de la API para la gestión de horarios en empresas de seguridad",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local",
    },
  ],
  components: {
    securitySchemes: {
      keycloak: {
        type: "oauth2",
        flows: {
          authorizationCode: {
            authorizationUrl: "http://localhost:8080/realms/seguridad-api/protocol/openid-connect/auth",
            tokenUrl: "http://localhost:8080/realms/seguridad-api/protocol/openid-connect/token",
            scopes: {
              openid: "Acceso básico",
            },
          },
        },
      },
    },
  },
  security: [
    {
      keycloak: ["openid"],
    },
  ],
};


const options = {
  definition: swaggerDefinition,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec, {
    swaggerOptions: {
      oauth2RedirectUrl: 'http://localhost:3000/api-docs/oauth2-redirect.html', // Esto debería funcionar bien
      oauth: {
        clientId: "api-node", // Verifica que este sea el cliente configurado en Keycloak
        scopes: "openid",
        usePkceWithAuthorizationCodeGrant: true,
      },
      persistAuthorization: false,
    },
  }));
  console.log("📄 Swagger disponible en http://localhost:3000/api-docs");
}

module.exports = swaggerDocs;
