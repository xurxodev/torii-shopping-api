import Product from "../entities/Product";
import ProductRepository from "../repositories/ProductRepository";

export default class GetProductByAsinUseCase {
    private repository: ProductRepository;

    constructor(resository: ProductRepository) {
        this.repository = resository;
    }

    public execute(asin: string): Promise<Product> {
        return this.repository.getByAsin(asin);
    }
}
