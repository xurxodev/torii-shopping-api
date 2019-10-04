import ProductRepository from "../boundaries/ProductRepository";
import Product from "../entities/Product";

export default class GetProductByAsinUseCase {
    private repository: ProductRepository;

    constructor(resository: ProductRepository) {
        this.repository = resository;
    }

    public execute(asin: string): Promise<Product> {
        return this.repository.getByAsin(asin);
    }
}
