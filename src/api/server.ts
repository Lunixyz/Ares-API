import http from "http";
import { app } from "./main";

const server = http.createServer(app).listen(3000);

export { server };
