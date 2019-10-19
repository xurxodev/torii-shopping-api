import BannerRepository from "../boundaries/BannerRepository";
import {BannerGroup} from "../entities/Banner";

export default class GetBannersUseCase {
    private repository: BannerRepository;

    constructor(resository: BannerRepository) {
        this.repository = resository;
    }

    public execute(): Promise<BannerGroup[]>  {
        return this.repository.get();
    }
}
