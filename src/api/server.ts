import https from "https";
import { app } from "./app";
import { Base } from "../components/components";

https.createServer(app).listen(3000);
console.log("Up & Running.");

const client = new Base();

export default client;
