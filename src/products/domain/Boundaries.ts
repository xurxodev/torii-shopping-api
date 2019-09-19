import Product from "./entities/Product";
import SearchResult from "./entities/SearchResult";

export default interface ProductRepository<> {
    getByAsin(asin: string): Promise<Product>;
    get(filter: string, page: number): Promise<SearchResult<Product>>;
}
