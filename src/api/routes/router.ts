import { Router } from "express";
import { readdirSync, stat } from "fs";
import path from "path";

export default Router();

class Routes {
  async loadAppRoutes(): Promise<void> {
    const Path = path.join(process.cwd(), "src", "api", "routes");
    const approutes = readdirSync(Path);
    console.log(Path);
    for (const files of approutes) {
      console.log(approutes);
      stat(`${process.cwd()}/src/api/routes/${files}`, async (err, file) => {
        if (err) throw err;
        if (file.isDirectory()) {
          const Path = path.join(
            process.cwd(),
            "src",
            "api",
            "routes",
            `${files}`
          );
          console.log(Path);
          const route = readdirSync(Path);

          for (const insidefile of route) {
            console.log(insidefile);
            if (insidefile.endsWith("ts")) {
              const module = await import(
                `${process.cwd()}/src/api/routes/${files}/${insidefile}`
              );
              module.default();
            }
          }
        }
        if (files.endsWith("ts") && !files.startsWith("router")) {
          const module = await import(
            `${process.cwd()}/src/api/routes/${files}`
          );
          module.default();
        }
      });
    }
  }
}

new Routes().loadAppRoutes();
