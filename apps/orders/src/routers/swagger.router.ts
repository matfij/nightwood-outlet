import { Router } from "express";
import { Routes } from "./orders.router";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerAutogen from "swagger-autogen";

export class SwaggerRouter implements Routes {
  public path = "/orders/docs";
  public router = Router();

  constructor() {
    this.generateDocs();
    this.initializeSwagger();
  }

  private generateDocs() {
    const doc = {
      info: {
        title: "Orders Service",
        version: "3.0.0",
      },
      host: "https://nightwood-outlet.dev/api/orders",
      schemes: ["https"],
    };
    const outputFile = "./swagger.json";
    const endpointsFiles = ["./src/app.ts"];
    swaggerAutogen(outputFile, endpointsFiles, doc);
  }

  private initializeSwagger() {
    const options: swaggerJSDoc.Options = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "Orders Service",
          version: "3.0.0",
        },
        components: {
          securitySchemes: {
            cookieAuth: {
              type: "apiKey",
              in: "cookie",
              name: "session",
            },
          },
        },
        security: [{ cookieAuth: [] }],
      },
      apis: ["./src/routers/*", "./src/mongo/*.interface.ts"],
    };
    const spec = swaggerJSDoc(options);
    this.router.use(`${this.path}`, swaggerUi.serve, swaggerUi.setup(spec));
  }
}
