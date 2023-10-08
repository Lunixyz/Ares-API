import { APIResponse } from "../interfaces/APIResponse";

export class Status {
  public api: Promise<Response>;
  public data: Promise<APIResponse>;
  constructor() {
    this.api = fetch(
      `https://api.steampowered.com/ICSGOServers_730/GetGameServersStatus/v1/?key=${process.env.KEY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    this.data = this.api.then(async (e) => {
      return (await e.json()) as unknown as APIResponse;
    });
  }

  private async getServices() {
    return await this.data.then((e) => e.result.services);
  }
  private async getDatacenters() {
    return await this.data.then((e) => e.result.datacenters);
  }
  private async getMatchmaker() {
    return await this.data.then((e) => e.result.matchmaking);
  }
  async getAllStatus() {
    return {
      services: await this.getServices(),
      datacenters: await this.getDatacenters(),
      matchmaker: await this.getMatchmaker(),
    };
  }
}
