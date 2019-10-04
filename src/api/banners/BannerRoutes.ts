import * as hapi from "hapi";
import BannerRepository from "../../data/banners/BannerInmemoryRepository";
import GetBannersUseCase from "../../domain/banners/usecases/GetBannersUseCase";
import jwtAuthentication from "../users/JwtAuthentication";
import BannerController from "./BannerController";

export default function(): hapi.ServerRoute[] {
  const bannerRepository = new BannerRepository();
  const getBannersUseCase = new GetBannersUseCase(bannerRepository);
  const bannerController = new BannerController(getBannersUseCase);

  return [
    {
      method: "GET",
      path: "/v1/banners",
      options: {
        auth: jwtAuthentication.name
      },
      handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
        return bannerController.getBanners(request, h);
      }
    }
  ];
}
