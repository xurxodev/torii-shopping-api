import ProductPrice from "./ProductPrice";

interface ProductPrices {
    _id: string;
    asin: string;
    ean: string;
    upc: string;
    isbn: string;
    prices: ProductPrice[];
}

export default ProducPrices;
