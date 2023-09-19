import { Request, Response, Router } from "express";
import * as dotenv from "dotenv";
import client from "../server";
import { cache } from "../../components/components";

dotenv.config();

class Routes {
  public cache: cache;
  constructor() {
    this.cache = new cache();
  }
  async getAppInfo(req: Request<{ appid: string }>, res: Response) {
    const appid = req.params.appid as string;

    this.cache.dumpMemoryKeys();

    if (this.cache.get(appid))
      return res.status(200).json({
        appid: parseInt(appid),
        cacheTTL: this.cache.getTTL(appid),
        data: this.cache.get(appid),
      });

    const productInfo = await client.getProductInfo([parseInt(appid)]);
    this.cache.put(appid, productInfo, 45);

    return res.status(200).json({
      appid: parseInt(appid),
      cacheTTL: this.cache.getTTL(appid),
      data: productInfo,
    });
  }

  async getAppChange(req: Request<{ changeid: string }>, res: Response) {
    const changenumber = req.params.changeid as string;
    const appid = req.query.appid as string;
    if (!appid)
      return res.status(400).json({ error: "appid is not in the query!" });

    this.cache.dumpMemoryKeys();

    if (this.cache.get(changenumber + appid))
      return res.status(200).json({
        changenumber: changenumber,
        appid: appid,
        cacheTTL: this.cache.getTTL(changenumber + appid),
        data: this.cache.get(changenumber + appid),
      });

    const changesFromApp = await client.getProductChanges(
      parseInt(changenumber),
      parseInt(appid)
    );
    this.cache.put(changenumber + appid, changesFromApp, 45);

    return res.status(200).json({
      changenumber: changenumber,
      appid: appid,
      data: changesFromApp,
    });
  }

  async getPackageChange(req: Request<{ changeid: string }>, res: Response) {
    const changenumber = req.params.changeid as string;
    const appid = req.query.appid as string;
    if (!appid)
      return res.status(400).json({ error: "appid is not in the query!" });

    this.cache.dumpMemoryKeys();

    if (this.cache.get(changenumber + appid))
      return res.status(200).json({
        changenumber: changenumber,
        appid: appid,
        cacheTTL: this.cache.getTTL(changenumber + appid),
        data: this.cache.get(changenumber + appid),
      });

    const changesFromPackage = await client.getPackageChanges(
      parseInt(changenumber),
      parseInt(appid)
    );
    this.cache.put(changenumber + appid, changesFromPackage, 45);

    return res.status(200).json({
      changenumber: changenumber,
      appid: appid,
      data: changesFromPackage,
    });
  }

  async getUserCount(req: Request<{ appid: string }>, res: Response) {
    const appid = req.params.appid as string;

    return res.status(200).json({
      appid: appid,
      playerCount: (await client.getAppUserCount(parseInt(appid))).playerCount,
    });
  }
}

export const router = Router();
const routes = new Routes();

router.get("/appinfo/:appid", async (req, res) => routes.getAppInfo(req, res));

router.get("/appchange/:changeid", async (req, res) =>
  routes.getAppChange(req, res)
);

router.get("/packagechange/:changeid", async (req, res) =>
  routes.getPackageChange(req, res)
);

router.get("/usercount/:appid", async (req, res) =>
  routes.getUserCount(req, res)
);
