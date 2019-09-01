import * as hapi from "hapi";
import productRoutes from "./products/presentation/ProductRoutes";

console.log(this);

// create a server with a host and port
const server: hapi.Server = new hapi.Server({
  host: "0.0.0.0",
  port: process.env.PORT || 8000
});

// initialize routes
productRoutes().forEach((route: hapi.ServerRoute) => {
  server.bind(route);
  server.route(route);
});

// start the server
async function start() {
  try {
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  console.log("Server running at:", server.info.uri);
}

// don't forget to call start
start();
