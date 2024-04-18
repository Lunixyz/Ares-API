import SteamUser from "steam-user";

//
// Steam Client
// This class runs a headless Steam Client.
//

class SteamClient extends SteamUser {
  constructor() {
    super({
      enablePicsCache: true,
      picsCacheAll: true,
      changelistUpdateInterval: 5000,
    });

    super.logOn({ anonymous: true });
    super.gamesPlayed(730);
  }
}

export default new SteamClient();
