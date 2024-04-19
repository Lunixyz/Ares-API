import { Router } from "express";
import root from "app-root-path";
import { readdirSync } from "fs";
import path from "path";

export default Router();

class Routes {
  async loadAppRoutes(): Promise<void> {
    const AppPath = path.resolve(process.cwd(), "src", "api", "routes", "app");
    const AppRoutes = readdirSync(AppPath);

    const AppsPath = path.resolve(
      process.cwd(),
      "src",
      "api",
      "routes",
      "apps"
    );
    const AppsRoutes = readdirSync(AppsPath);

    for (const file of AppRoutes) {
      if (file.endsWith("ts")) {
        const module = await import(`${root}/dist/src/api/routes/app/${file}`);
        module.default();
      }
    }

    for (const file of AppsRoutes) {
      if (file.endsWith("ts")) {
        const module = await import(`${root}/dist/src/api/routes/apps/${file}`);
        module.default();
      }
    }
  }
}

new Routes().loadAppRoutes();
