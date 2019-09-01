import ProductRepository from "../Boundaries";
import Product from "../Product";

export default class GetProductsUseCase {
    private repository: ProductRepository;

    constructor(resository: ProductRepository) {
        this.repository = resository;
    }

    public execute(filter: string): Promise<Product[]> {
        return this.repository.get(filter);
    }
}
