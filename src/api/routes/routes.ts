import { Request, Response, Router } from "express";
import * as dotenv from "dotenv";
import client from "../server";
import { Cache } from "../../modules/cache";
import { Status } from "../../modules/status";

dotenv.config();

class Routes {
  public cache: Cache;
  constructor() {
    this.cache = new Cache();
  }
  async getUpdatedApps(req: Request<{ appid: string }>) {
    const appid = req.params.appid as string;
    await client.getUpdatedApps(appid);
  }

  async getAppInfo(req: Request<{ appid: string }>, res: Response) {
    const appid = req.params.appid as string;

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
  async getCounterStrikeStatus(res: Response) {
    const getCache = this.cache.get("status");
    const cacheTTL = this.cache.getTTL("status");

    if (!getCache) {
      const status = await new Status().getAllStatus();
      this.cache.put("status", status, 45);
      return res.status(200).json({
        data: {
        cacheTTL,
        status,
      },
      });
    }

    return res.status(200).json({
      data: {
        cacheTTL,
        getCache,
        },
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

router.get("/updatedapps/:appid", async (req) => routes.getUpdatedApps(req));

router.get("/status", async (_, res) => routes.getCounterStrikeStatus(res));
