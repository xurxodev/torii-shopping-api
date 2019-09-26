import * as hapi from "hapi";
import BannerRepository from "../data/BannerInmemoryRepository";
import GetBannersUseCase from "../domain/usecases/GetBannersUseCase";
import BannerController from "./BannerController";

export default function(): hapi.ServerRoute[] {
  const bannerRepository = new BannerRepository();
  const getBannersUseCase = new GetBannersUseCase(bannerRepository);
  const bannerController = new BannerController(getBannersUseCase);

  const bannersHandler = (request: hapi.Request, h: hapi.ResponseToolkit) => {
    return bannerController.getBanners(request, h);
  };

  return [
    {
      method: "GET",
      path: "/banners",
      handler: bannersHandler
    },
    {
      method: "GET",
      path: "/v1/banners",
      handler: bannersHandler
    }
  ];
}
