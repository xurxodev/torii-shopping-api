import * as hapi from "hapi";
import ProductController from "../presentation/ProductController";

export default [
    {
        method: "GET",
        path: "/products",
        handler(request: hapi.Request, h: hapi.ResponseToolkit) {
          const productController = new ProductController();
          return productController.getProducts();
        }
      }
];
