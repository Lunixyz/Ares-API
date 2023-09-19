import http from "http";
import { app } from "./app";
import { Base } from "../components/components";

http.createServer(app).listen(3000);
console.log("Up & Running.");

const client = new Base();

export default client;
