import GlobalOffensive from "globaloffensive";
import SteamUser from "steam-user";

type appChanges = {
  appid: number;
  change_number: number;
  needs_token: boolean;
}[];

export class SteamClient extends SteamUser {
  constructor() {
    super({
      enablePicsCache: true,
      picsCacheAll: true,
      changelistUpdateInterval: 5000,
    });
    super.logOn();
    super.gamesPlayed(730);
  }
}

export class CsgoClient extends GlobalOffensive {}

export class Base {
  public steamClient: SteamUser;
  public csgoClient: GlobalOffensive;

  constructor() {
    this.steamClient = new SteamClient();
    this.csgoClient = new CsgoClient(this.steamClient);
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

  getUpdatedApps(appid: string) {
    return this.steamClient.picsCache.apps[appid];
  }

  getPackageInfo() {
    return this.steamClient.picsCache.packages;
  }
}
