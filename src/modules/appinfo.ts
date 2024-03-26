import GlobalOffensive from "globaloffensive";
import SteamUser from "steam-user";
import { Cache } from "./cache";
import { DATA } from "../interfaces/appinfo";

type appChanges = {
  appid: number;
  change_number: number;
  needs_token: boolean;
}[];

enum dataType {
  apps = "apps",
  packages = "packages",
  unknownApps = "unknownApps",
  unknownPackages = "unknownPackages",
}

enum appInfoType {
  appid = "appid",
  common = "common",
  depots = "depots",
  extended = "extended",
  config = "config",
  install = "install",
  ufs = "ufs",
  localization = "localization",
}

export class SteamClient extends SteamUser {
  constructor() {
    super({
      enablePicsCache: true,
      picsCacheAll: true,
      changelistUpdateInterval: 5000,
    });
    super.logOn({
      accountName: process.env.steamName ?? "",
      password: process.env.steamPassword ?? "",
    });
    super.gamesPlayed(730);
  }
}

export class Base {
  public cache: Cache;
  public steamClient: SteamUser;
  public csgoClient: GlobalOffensive;

  constructor() {
    this.steamClient = new SteamClient();
    this.csgoClient = new GlobalOffensive(this.steamClient);
    this.cache = new Cache();
  }

  get getPicsCache() {
    return this.steamClient.picsCache;
  }

  async getProductInfo(
    appids: number,
    dataType: dataType,
    appInfoType: appInfoType
  ) {
    const data = this.cache.get(appids.toString());

    if (!data) {
      const data = await this.steamClient.getProductInfo(
        [appids],
        [],
        true,
        (_, apps, packages, unknownApps, unknownPackages) => [
          apps,
          packages,
          unknownApps,
          unknownPackages,
        ]
      );

      this.cache.put(appids.toString(), data, 45);
      if (!appInfoType || !dataType) return data as DATA;

      if (dataType === "apps" && appInfoType)
        return (data as DATA).apps[appids].appinfo[appInfoType];
    }

    if (dataType === "apps" && appInfoType)
      return (data as DATA).apps[appids].appinfo[appInfoType];

    if (!appInfoType || !dataType) return data as DATA;
  }

  async getProductChanges(
    changenumber: number,
    filterAppId?: number | undefined
  ) {
    const app = (
      await this.steamClient.getProductChanges(changenumber, (err, change) => {
        if (err) throw err;
        return change;
      })
    ).appChanges as unknown as appChanges;

    if (filterAppId) return app.filter((p) => p.appid === filterAppId);
    return app;
  }

  async getPackageChanges(changenumber: number, filterAppId: number) {
    return (
      (
        await this.steamClient.getProductChanges(
          changenumber,
          (err, change) => {
            if (err) throw err;
            return change;
          }
        )
      ).packageChanges as unknown as appChanges
    ).filter((app) => app.appid === filterAppId);
  }

  getUpdatedApps(appid?: string) {
    if (appid) return this.steamClient.picsCache.apps[appid];
    return this.steamClient.picsCache.apps;
  }

  getPackageInfo() {
    return this.steamClient.picsCache.packages;
  }
}
