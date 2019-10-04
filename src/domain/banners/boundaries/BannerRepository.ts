import Banner from "../entities/Banner";

export default interface BannerRepository<> {
    get(): Promise<{ [key: string]: Banner[] }>;
}
