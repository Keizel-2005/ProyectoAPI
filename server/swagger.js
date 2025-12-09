import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API RankingFit",
      version: "1.0.0",
      description: "Documentación de la API del sistema de rankings",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./routes/*.js"], 
};
export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
