import ProductPrices from "../entities/ProductPrices";

export default interface ProductPricesProvider<> {
    get(): Promise<ProductPrices[]>;
}
