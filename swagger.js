const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
  definition: {
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
  },
  apis: ["./routes/*.js"], 
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  console.log("📄 Swagger disponible en http://localhost:3000/api-docs");
}

module.exports = swaggerDocs;
