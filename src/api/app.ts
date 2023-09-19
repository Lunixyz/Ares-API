import express from "express";
import { router } from "./routes/routes";
import bodyParser from "body-parser";
import csurf from "csurf";
import helmet from "helmet";
import cookieParser from "cookie-parser";
export const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(csurf({ cookie: true }));
app.use((err, res, next) => {
  if (err && err.statusMessage === "EBADCSRFTOKEN") {
    res.status(403).send("Token CSRF inválido");
  } else {
    next();
  }
});
app.use(helmet());
app.use(router);
app.set("json spaces", 2);
