import { Router } from "express";
import root from "app-root-path";
import { readdirSync, stat } from "fs";

export default Router();

class Routes {
  async loadAppRoutes(): Promise<void> {
    const approutes = readdirSync(`${root}/src/api/routes`);

    for (const files of approutes) {
      stat(`${root}/src/api/routes/${files}`, async (err, file) => {
        if (err) throw err;
        if (file.isDirectory()) {
          const route = readdirSync(`${root}/src/api/routes/${files}`);

          for (const insidefile of route) {
            if (insidefile.endsWith("ts")) {
              const module = await import(
                `${root}/src/api/routes/${files}/${insidefile}`
              );
              module.default();
            }
          }
        }
        if (files.endsWith("ts") && !files.startsWith("router")) {
          const module = await import(`${root}/src/api/routes/${files}`);
          module.default();
        }
      });
    }
  }
}

new Routes().loadAppRoutes();
