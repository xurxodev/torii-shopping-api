import ProductRepository from "../Boundaries";
import Product from "../Product";

export default class GetProductsUseCase {
    private repository: ProductRepository;

    constructor(resository: ProductRepository) {
        this.repository = resository;
    }

    public execute(filter: string): Promise<Product[]> {
        const asin = this.tryExtractAsin(filter);

        if (asin) {
            filter = asin;
        }

        return this.repository.get(filter);
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
