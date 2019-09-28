import * as hapi from "hapi";
import jwtAuthentication from "../../users/authentication/JwtAuthentication";
import BannerRepository from "../data/BannerInmemoryRepository";
import GetBannersUseCase from "../domain/usecases/GetBannersUseCase";
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
