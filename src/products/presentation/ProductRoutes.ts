import * as dotenv from "dotenv";
import * as hapi from "hapi";
import jwtAuthentication from "../../users/authentication/JwtAuthentication";
import ProductRepository from "../data/ProductRepository";
import GetProductByAsinUseCase from "../domain/usecases/GetProductByAsinUseCase";
import GetProductsUseCase from "../domain/usecases/GetProductsUseCase";
import ProductController from "../presentation/ProductController";

export default function(): hapi.ServerRoute[] {

  dotenv.config();

  const productRepository = new ProductRepository(
    process.env.AMZ_ASSOCIATE_TAG,
    process.env.AMZ_ACCESS_KEY_ID,
    process.env.AMZ_SECRET_ACCESS_KEY, "ES");

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
