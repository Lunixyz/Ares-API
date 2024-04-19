import appRootPath from "app-root-path";
import { Router } from "express";
import { readdirSync, stat } from "fs";
import path from "path";

export default Router();

class Routes {
  async loadAppRoutes(): Promise<void> {
    const Path = path.join(`${appRootPath}`, "src", "api", "routes");
    const approutes = readdirSync(Path);
    for (const files of approutes) {
      stat(`${appRootPath}/src/api/routes/${files}`, async (err, file) => {
        if (err) throw err;
        if (file.isDirectory()) {
          const Path = path.join(
            `${appRootPath}`,
            "src",
            "api",
            "routes",
            `${files}`
          );
          const route = readdirSync(Path);

          for (const insidefile of route) {
            if (insidefile.endsWith("ts")) {
              const module = await import(
                `${appRootPath}/src/api/routes/${files}/${insidefile}`
              );
              module.default();
            }
          }
        }
        if (files.endsWith("ts") && !files.startsWith("router")) {
          const module = await import(`${appRootPath}/src/api/routes/${files}`);
          module.default();
        }
      });
    }
  }
}

const routes = new Routes();

(async () => {
  await routes.loadAppRoutes();
})();
