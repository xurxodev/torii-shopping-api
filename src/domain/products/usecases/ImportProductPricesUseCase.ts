import ProductPricesProvider from "../boundaries/ProductPricesProvider";
import ProductPricesRepository from "../boundaries/ProductPricesResository";

export default class ImportProductPricesUseCase {
    private productPricesProvider: ProductPricesProvider;
    private productPricesRepository: ProductPricesRepository;

    constructor(productPricesProvider: ProductPricesProvider,
                productPricesRepository: ProductPricesRepository) {
        this.productPricesProvider = productPricesProvider;
        this.productPricesRepository = productPricesRepository;
    }

    public execute(): Promise<void> {
        return this.productPricesProvider.get()
        .then((productPrices) => this.productPricesRepository.save(productPrices));
    }
}
