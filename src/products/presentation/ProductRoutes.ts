import * as hapi from "hapi";
import ProductRepository from "../data/ProductInmemoryRepository";
import GetProductByAsinUseCase from "../domain/usecases/GetProductByAsinUseCase";
import GetProductsUseCase from "../domain/usecases/GetProductsUseCase";
import ProductController from "../presentation/ProductController";

export default function(): hapi.ServerRoute[] {
  const productRepository = new ProductRepository();
  const getProductsUseCase = new GetProductsUseCase(productRepository);
  const getProductByIdUseCase = new GetProductByAsinUseCase(productRepository);
  const productController = new ProductController(getProductsUseCase, getProductByIdUseCase);

  return [
    {
      handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
        return productController.getProducts(request, h);
      },
      method: "GET",
      path: "/products"
    },
    {
      handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
        return productController.getProductById(request, h);
      },
      method: "GET",
      path: "/products/{asin}"
    }
  ];
}
