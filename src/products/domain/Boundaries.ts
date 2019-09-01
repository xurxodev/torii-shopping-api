import Product from "./Product";

export default interface ProductRepository<> {
    getByAsin(asin: string): Promise<Product>;
    get(filter: string): Promise<Product[]>;
}
