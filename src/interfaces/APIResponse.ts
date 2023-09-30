export enum STATUS {
  offline = "offline",
  surge = "crítico",
  delayed = "lento",
  normal = "normal",
}

export enum LOAD {
  idle = "inativo",
  low = "baixo",
  medium = "médio",
  high = "alto",
}

export enum CAPACITY {
  low = "baixa",
  medium = "média",
  high = "alta",
  full = "cheio",
}

export interface MATCHMAKING {
  scheduler: STATUS;
  online_servers: number;
  online_players: number;
  searching_players: number;
  search_seconds_avg: number;
}

export interface SERVICES {
  SessionsLogon: STATUS;
  SteamCommunity: STATUS;
  IEconItems: STATUS;
  Leaderboards: STATUS;
}

export interface DATACENTERINF {
  capacity: CAPACITY;
  load: LOAD;
}

export interface DATACENTERS {
  Peru: DATACENTERINF;
  "EU West": DATACENTERINF;
  "EU East": DATACENTERINF;
  Poland: DATACENTERINF;
  "India East": DATACENTERINF;
  "Hong Kong": DATACENTERINF;
  Spain: DATACENTERINF;
  Chile: DATACENTERINF;
  "US Southwest": DATACENTERINF;
  "US Southeast": DATACENTERINF;
  India: DATACENTERINF;
  "EU North": DATACENTERINF;
  Emirates: DATACENTERINF;
  "US Northwest": DATACENTERINF;
  "South Africa": DATACENTERINF;
  Brazil: DATACENTERINF;
  "US Northeast": DATACENTERINF;
  "US Northcentral": DATACENTERINF;
  Japan: DATACENTERINF;
  Argentine: DATACENTERINF;
  "South Korea": DATACENTERINF;
  Singapore: DATACENTERINF;
  Australia: DATACENTERINF;
  "China Shanghai": DATACENTERINF;
  "China Tianjin": DATACENTERINF;
  "China Guangzhou": DATACENTERINF;
}

export interface APIResponse {
  result: {
    app: {
      version: number;
      timestamp: EpochTimeStamp;
      time: string;
    };
    services: SERVICES;
    datacenters: DATACENTERS;

    matchmaking: MATCHMAKING;
  };
}
