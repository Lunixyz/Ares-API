export interface DATA {
  apps: {
    [appid: number]: {
      changenumber: number;
      missingToken: boolean;
      appinfo: {
        appid: string;
        common: COMMON;
      };
    };
  };
  unkownApps: number[];
  unknownPackages: number[];
}

export interface COMMON {
  clienticon: string;
  clienttga: string;
  name: string;
  languages: LANGUAGES;
  logo: string;
  logo_small: string;
  icon: string;
  metacritic_url: string;
  clienticns: string;
  oslist: string;
  type: string;
  linuxclienticon: string;
  exfgls: "0" | "1";
  osarch: string;
  osextended: string;
  steamchinaapproved: string;
  name_localized: NAMELOCALIZED;
  releasestatsteamchina: string;
  content_descriptors: CONTENTDESCRIPTORS;
  has_adult_content: "0" | "1";
  has_adult_content_violence: "0" | "1";
  steam_deck_compatibility: STEAMDECKCOMPATIBILITY;
  market_presence: "0" | "1";
  controllertagwizard: "0" | "1";
  small_capsule: SMALLCAPSULE;
  header_image: HEADERIMAGE;
  library_assets: LIBRARYASSETS;
  store_asset_mtime: EpochTimeStamp;
  associations: ASSOCIATIONS;
  primary_genre: string;
  genres: GENRES;
  category: CATEGORY;
}

export interface LANGUAGES {
  english: "0" | "1";
  german: "0" | "1";
  french: "0" | "1";
  italian: "0" | "1";
  koreana: "0" | "1";
  spanish: "0" | "1";
  schinese: "0" | "1";
  tchinese: "0" | "1";
  russian: "0" | "1";
  thai: "0" | "1";
  japanese: "0" | "1";
  portuguese: "0" | "1";
  polish: "0" | "1";
  danish: "0" | "1";
  dutch: "0" | "1";
  finnish: "0" | "1";
  norwegian: "0" | "1";
  swedish: "0" | "1";
  hungarian: "0" | "1";
  czech: "0" | "1";
  romanian: "0" | "1";
  turkish: "0" | "1";
  brazilian: "0" | "1";
  bulgarian: "0" | "1";
  greek: "0" | "1";
  ukrainian: "0" | "1";
  vietnamese: "0" | "1";
  latam: "0" | "1";
}

export interface NAMELOCALIZED {
  sc_schinese: string;
}

export interface CONTENTDESCRIPTORS {
  0: string;
  1: string;
}

export interface STEAMDECKCOMPATIBILITY {
  category: string;
  test_timestamp: string;
  tested_build_id: string;
}

export interface SMALLCAPSULE {
  english: string;
  sc_schinese: string;
  schinese: string;
}

export interface HEADERIMAGE {
  english: string;
  sc_schinese: string;
  schinese: string;
}

export interface LIBRARYASSETS {
  library_capsule: string;
  library_hero: string;
  library_logo: string;
  logo_position: {
    pinned_position: string;
    width_pct: string;
    height_pct: string;
  };
}

export interface ASSOCIATIONS {
  0: {
    type: string;
    name: string;
  };
  1: {
    type: string;
    name: string;
  };
}

export interface GENRES {
  0: string;
  1: string;
}

export interface CATEGORY {
  category_1: "0" | "1";
  category_15: "0" | "1";
  category_8: "0" | "1";
  category_29: "0" | "1";
  category_30: "0" | "1";
  category_33: "0" | "1";
  category_35: "0" | "1";
  category_43: "0" | "1";
  category_45: "0" | "1";
  category_46: "0" | "1";
  category_41: "0" | "1";
  category_42: "0" | "1";
  category_27: "0" | "1";
}
