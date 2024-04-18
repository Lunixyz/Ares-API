import GlobalOffensive from "globaloffensive";
import SteamClient from "./steam";

//
// Counter-Strike Client
// This class runs a headless Counter-Strike Client.
//

class CounterStrikeClient extends GlobalOffensive {
  constructor() {
    super(SteamClient);
  }
}

export default new CounterStrikeClient();
