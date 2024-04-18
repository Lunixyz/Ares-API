import https from "http";
import { app } from "./main";

const server = https.createServer(app).listen(3000);

export { server };
