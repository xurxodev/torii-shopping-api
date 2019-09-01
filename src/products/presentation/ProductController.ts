
import * as boom from "@hapi/boom";
import * as hapi from "hapi";
import GetProductByAsinUseCase from "../domain/usecases/GetProductByAsinUseCase";
import GetProductsUseCase from "../domain/usecases/GetProductsUseCase";

export default class ProductController {

    private getProductsUseCase: GetProductsUseCase;
    private getProductByAsinUseCase: GetProductByAsinUseCase;

    constructor(
        getProductsUseCase: GetProductsUseCase,
        getProductByAsinUseCase: GetProductByAsinUseCase) {
        this.getProductsUseCase = getProductsUseCase;
        this.getProductByAsinUseCase = getProductByAsinUseCase;
    }

    public getProducts(request: hapi.Request, h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        return this.getProductsUseCase.execute(undefined);
    }

    public getProductById(request: hapi.Request, h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        if (request.params.asin) {
            return this.getProductByAsinUseCase.execute(request.params.asin)
                .catch(
                    (reason) => boom.notFound(reason)
                );
        }
    }
}
