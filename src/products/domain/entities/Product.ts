import ProductPrice from "./ProductPrice";

interface Product {
    asin: string;
    description: string;
    ean: string;
    images: string[];
    name: string;
    upc: string;
    prices: ProductPrice[];
}

export default Product;
