import { API, APIDEFAULT } from "../dictionaries/API";
import cache from "./cache";

class Status {
  public API: Promise<Response> | null = null;
  public data: Promise<API | APIDEFAULT> | null = null;
  private API_URL: string = `https://api.steampowered.com/ICSGOServers_730/GetGameServersStatus/v1/?key=${process.env.KEY}`;
  private default_json = {
    result: {
      services: "unknown",
      datacenters: "unknown",
      matchmaking: "unknown",
    },
  };

  private async setAPI(): Promise<void> {
    //
    //  Using the Steam API to fetch Counter-Strike's server data
    //
    const getCache = cache.get("status") as Promise<Response>;

    if (!(await getCache)) {
      const response = fetch(this.API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      cache.put("status", response, 35);

      this.API = response;
      return;
    }
    this.API = getCache;
  }

  public async getStatus(): Promise<API | APIDEFAULT> {
    await this.setAPI();
    if (!this.API) return this.default_json as APIDEFAULT;

    //
    //  Defining this.data as the API Response OR the default parameters
    //  intercepting the API's response is very important, because
    //  Steam likes to take down its own API routes sometimes.
    //

    this.data = this.API.then(async (e) => {
      const response = await e.json();
      if (response == null) return this.default_json as APIDEFAULT;
      return response as unknown as Promise<API>;
    });

    const data = await this.data;
    if (!data) return this.default_json as APIDEFAULT;

    return {
      result: {
        services: data.result.services,
        datacenters: data.result.datacenters,
        matchmaking: data.result.matchmaking,
      },
    };
  }
}

export default new Status();
