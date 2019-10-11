import * as csv from "csv-parser";
import * as dotenv from "dotenv";
import * as request from "request";
import * as zlib from "zlib";

import ProductPricesProvider from "../../domain/products/boundaries/ProductPricesProvider";
import ProductPrices from "../../domain/products/entities/ProductPrices";

dotenv.config();

export default class ProductPricesAwinProvider implements ProductPricesProvider {
    public get(): Promise<ProductPrices[]> {
        console.log("Retrieving product prices from awin ...");

        const productPricesDictionary: { [id: string]: ProductPrices; } = {};

        return new Promise((resolve, reject) => {

            const fileUrl = `https://productdata.awin.com/datafeed/download/apikey/${process.env.AWIN_API_KEY}/language/any/fid/${process.env.AWIN_PROGRAMS}/columns/aw_deep_link,aw_product_id,merchant_product_id,merchant_id,merchant_name,search_price,currency,saving,ean,isbn,upc,mpn,product_GTIN,display_price/format/csv/delimiter/%7C/compression/gzip/`;

            const gunzip = zlib.createGunzip();

            request.get({ url: fileUrl, gzip: true })
                .pipe(gunzip)
                .pipe(csv({ separator: "|" }))
                .on("data", (data) => {
                    const product = this.parseProduct(data);

                    if (product._id) {
                        const existedProduct = productPricesDictionary[product._id];

                        if (existedProduct) {
                            if (!existedProduct.prices.some((ep) => ep.store === product.prices[0].store)) {
                                existedProduct.prices.push(product.prices[0]);
                            }
                        } else {
                            productPricesDictionary[product._id] = product;
                        }
                    }
                })
                .on("end", () => {
                    const productPrices: ProductPrices[] = Object.values(productPricesDictionary);
                    resolve(productPrices);
                    console.log(`Retrieved product prices from awin, num products:${productPrices.length}`);
                })
                .on("error", (e) => {
                    console.log(e);
                });
        });
    }

    private parseProduct(awinProduct: any): any {
        let storeImage = `https://ui2.awin.com/logos/${awinProduct.merchant_id}/logo.gif`;

        if (awinProduct.merchant_name === "Acer ES") {
            storeImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Acer_2011.svg/100px-Acer_2011.svg.png";
        }

        let price: number = 0.0;
        let priceString: string = "";

        if (awinProduct.saving) {
            priceString = awinProduct.saving.replace("EUR", "").trim();
        } else {
            priceString = awinProduct.search_price;
        }

        price  = +(+priceString).toFixed(2);

        return {
            _id: awinProduct.product_GTIN ? awinProduct.product_GTIN : awinProduct.ean,
            asin: "",
            ean: awinProduct.ean,
            upc: awinProduct.upc,
            isbn: awinProduct.isbn,
            prices: [
                {
                    store: awinProduct.merchant_name,
                    storeImage,
                    url: awinProduct.aw_deep_link,
                    price,
                    currency: awinProduct.currency
                }
            ]
        };
    }

}
