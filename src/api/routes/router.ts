import { Router } from "express";
import root from "app-root-path";
import { readdirSync } from "fs";

export default Router();

class Routes {
  async loadAppRoutes(): Promise<void> {
    const approutes = readdirSync(`${root}/src/api/routes/app`);

    for (const file of approutes) {
      if (file.endsWith("ts")) {
        const module = await import(`${root}/src/api/routes/app/${file}`);
        module.default();
      }
    }
  }
}

new Routes().loadAppRoutes();
