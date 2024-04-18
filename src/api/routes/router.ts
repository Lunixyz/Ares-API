import { Router } from "express";
import root from "app-root-path";
import { readdirSync } from "fs";

export default Router();

class Routes {
  async loadAppRoutes(): Promise<void> {
    const approutes = readdirSync(`${root}/dist/src/api/routes/app`);

    for (const file of approutes) {
      if (file.endsWith("js")) {
        const module = await import(`${root}/dist/src/api/routes/app/${file}`);
        module.default();
      }
    }
  }
}

new Routes().loadAppRoutes();
