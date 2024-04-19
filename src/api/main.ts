import express from "express";
import csurf from "csurf";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import router from "./routes/router";

const app = express();

dotenv.config();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(csurf({ cookie: { httpOnly: false, secure: true } }));

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

export { app };
