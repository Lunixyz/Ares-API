import GlobalOffensive from "globaloffensive";
import SteamUser from "steam-user";

type appChanges = {
  appid: number;
  change_number: number;
  needs_token: boolean;
}[];

export class steamClient extends SteamUser {
  constructor() {
    super({
      autoRelogin: true,
      enablePicsCache: true,
      picsCacheAll: true,
      changelistUpdateInterval: 5000,
    });
    super.logOn({
      accountName: process.env.steam_login,
      password: process.env.steam_password,
    });
    super.gamesPlayed(730);
  }
}

export class csgoClient extends GlobalOffensive {
  constructor(steamClient: SteamUser) {
    super(steamClient);
  }
}

export class Base {
  public steamClient: SteamUser;
  public csgoClient: GlobalOffensive;

  constructor() {
    this.steamClient = new steamClient();
    this.csgoClient = new csgoClient(this.steamClient);
  }

  get getPicsCache() {
    return this.steamClient.picsCache;
  }

  getProductInfo(appids: number[]) {
    return this.steamClient.getProductInfo(
      appids,
      [],
      true,
      (_, apps, packages, unknownApps, unknownPackages) => [
        apps,
        packages,
        unknownApps,
        unknownPackages,
      ]
    );
  }

  getAppUserCount(appid: number) {
    return this.steamClient.getPlayerCount(appid);
  }

  async getProductChanges(changenumber: number, filterAppId: number) {
    return (
      (
        await this.steamClient.getProductChanges(changenumber, (err, change) =>
          err ? err : change
        )
      ).appChanges as unknown as appChanges
    ).filter((app) => app.appid === filterAppId);
  }

  async getPackageChanges(changenumber: number, filterAppId: number) {
    return (
      (
        await this.steamClient.getProductChanges(changenumber, (err, change) =>
          err ? err : change
        )
      ).packageChanges as unknown as appChanges
    ).filter((app) => app.appid === filterAppId);
  }

  getUpdatedApps(appid: string) {
    return this.steamClient.picsCache.apps[appid];
  }

  getPackageInfo() {
    return this.steamClient.picsCache.packages;
  }
}

export class cache {
  cache: {
    [key: string]: {
      value: unknown;
      expireDate: number;
    };
  } = {};

  put(k: string, v: unknown, ttl: number) {
    const expireDate = Date.now() + ttl * 1000;
    this.cache[k] = {
      value: v,
      expireDate: expireDate,
    };

    return true;
  }

  get(k: string) {
    if (this.cache[k]?.expireDate && this.cache[k].expireDate > Date.now()) {
      return this.cache[k].value;
    }
    delete this.cache[k];
    return undefined;
  }

  getTTL(k: string) {
    return Math.max(this.cache[k]?.expireDate - Date.now() ?? 0, 0);
  }
}
