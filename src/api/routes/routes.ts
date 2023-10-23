import { Router } from "express";
import * as dotenv from "dotenv";
import { Routes } from "../../modules/route";

dotenv.config();

export const router = Router();
const routes = new Routes();

router.get("/appinfo/:appid/:dataType?/:json?", async (req, res) =>
  routes.getAppInfo(req, res)
);

router.get("/appchange/:changeid", async (req, res) =>
  routes.getAppChange(req, res)
);

router.get("/packagechange/:changeid", async (req, res) =>
  routes.getPackageChange(req, res)
);


router.get("/updatedapps/:appid", async (req) => routes.getUpdatedApps(req));

router.get("/status", async (_, res) => routes.getCounterStrikeStatus(res));
