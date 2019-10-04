import Product from "../entities/Product";
import SearchResult from "../entities/SearchResult";

export default interface ProductRepository<> {
    getByAsin(asin: string): Promise<Product>;
    get(filter: string, page: number, category: string): Promise<SearchResult<Product>>;
}
