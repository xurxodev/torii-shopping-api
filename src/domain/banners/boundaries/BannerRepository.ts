import { BannerGroup } from "../entities/Banner";

export default interface BannerRepository<> {
    get(): Promise<BannerGroup[]>;
}
