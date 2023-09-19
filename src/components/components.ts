import { access, constants, writeFileSync } from "fs";
import GlobalOffensive from "globaloffensive";
import SteamUser from "steam-user";
import root from "app-root-path";

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
    this.log(`Tried to store key "${k}" in memory`);
    const expireDate = Date.now() + ttl * 1000;
    this.cache[k] = {
      value: v,
      expireDate: expireDate,
    };

    return true;
  }

  get(k: string) {
    if (this.cache[k]?.expireDate && this.cache[k].expireDate > Date.now()) {
      this.log(`Tried to load "${k}" off memory`);
      return this.cache[k].value;
    }
    delete this.cache[k];
    return undefined;
  }

  getTTL(k: string) {
    this.log(`Tried to load "${k}" off memory`);
    return Math.max(this.cache[k]?.expireDate - Date.now() ?? 0, 0);
  }

  dumpMemoryKeys() {
    this.log(`Dumped memory: ${JSON.stringify(Object.keys(this.cache))}`);
  }

  private log(data: string) {
    const trackTime = new Date();
    access(`${root}/logs/log.txt`, constants.F_OK | constants.W_OK, (err) => {
      if (err) {
        writeFileSync(
          `${root}/logs/log.txt`,
          `<Neptune API @ ${trackTime.getHours()}:${trackTime.getMinutes()}:${String(
            trackTime.getSeconds()
          ).padStart(2, "0")}> -> ${data}`,
          "utf-8"
        );
      }
    });

    writeFileSync(
      `${root}/logs/log.txt`,
      `<Neptune API @ ${trackTime.getHours()}:${trackTime.getMinutes()}:${String(
        trackTime.getSeconds()
      ).padStart(2, "0")}> -> ${data}\n`,
      {
        flag: "a",
      }
    );
  }
}
