
import ProductPricesAwinProvider from "./data/products/ProductPricesAwinProvider";
import ProductPricesRepository from "./data/products/ProductPricesRepository";
import ImportProductPricesUseCase from "./domain/products/usecases/ImportProductPricesUseCase";

const productPriceProvider = new ProductPricesAwinProvider();
const productPricesRepository = new ProductPricesRepository();
const importProductPricesUseCase =
    new ImportProductPricesUseCase(productPriceProvider, productPricesRepository);

importProductPricesUseCase.execute()
    .then(() => {
        console.log("Import finished successfully!!");
    })
    .catch((err) => {
        console.log("Import failed!!!");

    })
    .finally(() => {
        process.exit();
    });
