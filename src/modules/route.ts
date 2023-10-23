import client from "../api/server";
import { Request, Response } from "express";
import { Cache } from "./cache";
import { Status } from "./status";

enum dataType {
  apps = "apps",
  packages = "packages",
  unknownApps = "unknownApps",
  unknownPackages = "unknownPackages",
}

enum appInfoType {
  common = "common",
  depots = "depots",
  extended = "extended",
  config = "config",
  install = "install",
  ufs = "ufs",
  localization = "localization",
}

export class Routes {
  public cache: Cache;
  constructor() {
    this.cache = new Cache();
  }
  async getUpdatedApps(req: Request<{ appid: string }>) {
    const appid = req.params.appid as string;
    await client.getUpdatedApps(appid);
  }

  async getAppInfo(
    req: Request<{
      appid: string;
      dataType?: string;
      json?: string;
    }>,
    res: Response
  ) {
    const appid = req.params.appid as string;
    const dataType = req.params.dataType as dataType;
    const appInfoType = req.params.json as appInfoType;

    const productInfo = await client.getProductInfo(
      parseInt(appid),
      dataType,
      appInfoType
    );
    this.cache.put(appid + dataType, productInfo, 45);

    return res.status(200).json({
      appid: parseInt(appid),
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

  async getCounterStrikeStatus(res: Response) {
    const getCache = this.cache.get("status");

    if (getCache) {
      const cacheTTL = this.cache.getTTL("status");
      return res.status(200).json({
        data: {
          cacheTTL,
          getCache,
        },
      });
    }

    const status = await new Status().getAllStatus();
    this.cache.put("status", status, 45);

    return res.status(200).json({
      data: {
        status,
      },
    });
  }
}
