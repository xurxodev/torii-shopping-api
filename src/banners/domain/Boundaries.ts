import Banner from "./Banner";

export default interface BannerRepository<> {
    get(): Promise<{ [key: string]: Banner[] }>;
}
