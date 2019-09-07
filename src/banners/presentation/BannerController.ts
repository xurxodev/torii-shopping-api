
import * as boom from "@hapi/boom";
import * as hapi from "hapi";
import GetBannersUseCase from "../domain/usecases/GetBannersUseCase";

export default class ProductController {

    private getBannersUseCase: GetBannersUseCase;

    constructor(
        getBannersUseCase: GetBannersUseCase) {
        this.getBannersUseCase = getBannersUseCase;
    }

    public getBanners(request: hapi.Request, h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        return this.getBannersUseCase.execute();
    }
}
