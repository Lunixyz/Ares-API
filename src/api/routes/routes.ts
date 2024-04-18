import { Router } from "express";
import * as dotenv from "dotenv";
import { Routes } from "../../modules/route";

dotenv.config();

export const router = Router();
const routes = new Routes();

router.get("/app/:appid/:dataType?/:json?", async (req, res) =>
  routes.getAppInfo(req, res)
);

router.get("/app/change/:changeid", async (req, res) =>
  routes.getAppChange(req, res)
);

router.get("/app/package/:changeid", async (req, res) =>
  routes.getPackageChange(req, res)
);

router.get("/app/updates/:appid", async (req) => routes.getUpdatedApps(req));

router.get("/status", async (_, res) => routes.getCounterStrikeStatus(res));
