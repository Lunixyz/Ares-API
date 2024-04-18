import { Router } from "express";
import root from "app-root-path";
import { readdirSync } from "fs";
import path from "path";

export default Router();

class Routes {
  async loadAppRoutes(): Promise<void> {
    const Path = path.resolve(
      process.cwd(),
      "dist",
      "src",
      "api",
      "routes",
      "app"
    );
    const approutes = readdirSync(Path);

    for (const file of approutes) {
      if (file.endsWith("js")) {
        const module = await import(`${root}/dist/src/api/routes/app/${file}`);
        module.default();
      }
    }
  }
}

new Routes().loadAppRoutes();
