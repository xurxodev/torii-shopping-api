import * as hapi from "hapi";
import bannerRoutes from "./api/banners/BannerRoutes";
import productRoutes from "./api/products/ProductRoutes";
import suggestionRoutes from "./api/suggestions/SuggestionRoutes";
import jwtAuthentication from "./api/users/JwtAuthentication";
import userRoutes from "./api/users/UserRoutes";

// create a server with a host and port
const server: hapi.Server = new hapi.Server({
  host: "0.0.0.0",
  port: process.env.PORT || 8000
});

// start the server
async function start() {
  try {
    await server.register(require("hapi-auth-jwt2"));
    const validate = jwtAuthentication.validateHandler;
    const secretKey = jwtAuthentication.secretKey;

    server.auth.strategy(jwtAuthentication.name, "jwt", {
      key: secretKey,
      validate
    });

    server.auth.default(jwtAuthentication.name);

    server.route([
      {
        method: "GET",
        path: "/",
        options: { auth: false },
        handler: async (req, res) => {
          return "Welcome to torii shopping API!!";
        }
      }
    ]);

    // initialize users routes
    userRoutes().forEach((route: hapi.ServerRoute) => {
      server.route(route);
    });

    // initialize products routes
    productRoutes().forEach((route: hapi.ServerRoute) => {
      server.route(route);
    });

    // initialize banners routes
    bannerRoutes().forEach((route: hapi.ServerRoute) => {
      server.route(route);
    });

    // initialize suggestions routes
    suggestionRoutes().forEach((route: hapi.ServerRoute) => {
      server.route(route);
    });

    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  console.log("Server running at:", server.info.uri);
}

// don't forget to call start
start();
