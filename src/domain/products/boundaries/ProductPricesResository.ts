import ProductPrices from "../entities/ProductPrices";

export default interface ProductPricesRepository<> {
    save(productPrices: ProductPrices): Promise<void>;
}
