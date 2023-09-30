import http from "http";
import { app } from "./app";
import { Base } from "../modules/appinfo";

http.createServer(app).listen(3000);
console.log("Up & Running.");

const client = new Base();

export default client;
