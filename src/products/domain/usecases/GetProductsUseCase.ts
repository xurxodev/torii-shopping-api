import Product from "../entities/Product";
import SearchResult from "../entities/SearchResult";
import ProductRepository from "../repositories/ProductRepository";

export default class GetProductsUseCase {
    private repository: ProductRepository;

    constructor(resository: ProductRepository) {
        this.repository = resository;
    }

    public execute(filter: string, page: number, category: string): Promise<SearchResult<Product>> {
        const asin = this.tryExtractAsin(filter);

        if (asin) {
            filter = asin;
        }

        return this.repository.get(filter, page, category);
    }

    private tryExtractAsin(filter: string): string {
        let asin = "";

        const regex = RegExp("https://www.amazon.*/([\\w-]+/)?(dp|gp/product)/(\\w+/)?(\\w{10})");
        const match = filter.match(regex);
        if (match) {
            asin = match[4];
        }

        return asin;
    }
}
