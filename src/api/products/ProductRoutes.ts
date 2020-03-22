import * as dotenv from "dotenv";
import * as hapi from "hapi";
import ProductRepository from "../../data/products/ProductRepository";
import GetProductByAsinUseCase from "../../domain/products/usecases/GetProductByAsinUseCase";
import GetProductsUseCase from "../../domain/products/usecases/GetProductsUseCase";
import jwtAuthentication from "../users/JwtAuthentication";
import ProductController from "./ProductController";

export default function(): hapi.ServerRoute[] {

  dotenv.config();

  const productRepository = new ProductRepository(
    process.env.AMZ_ASSOCIATE_TAG,
    process.env.AMZ_ACCESS_KEY_ID,
    process.env.AMZ_SECRET_ACCESS_KEY,
    process.env.AMZ_HOST,
    process.env.AMZ_REGION);

  const getProductsUseCase = new GetProductsUseCase(productRepository);
  const getProductByIdUseCase = new GetProductByAsinUseCase(productRepository);
  const productController = new ProductController(getProductsUseCase, getProductByIdUseCase);

  return [
    {
      method: "GET",
      path: "/v1/products",
      options: {
        auth: jwtAuthentication.name
      },
      handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
        return productController.getProducts(request, h);
      }
    },
    {
      method: "GET",
      path: "/v1/products/{asin}",
      options: {
        auth: jwtAuthentication.name
      },
      handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
        return productController.getProductById(request, h);
      }
    }
  ];
}
