import Banner from "../Banner";
import BannerRepository from "../Boundaries";

export default class GetBannersUseCase {
    private repository: BannerRepository;

    constructor(resository: BannerRepository) {
        this.repository = resository;
    }

    public execute(): Promise<{ [key: string]: Banner[] }>  {
        return this.repository.get();
    }
}
