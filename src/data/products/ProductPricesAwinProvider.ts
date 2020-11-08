import * as csv from "csv-parser";
import * as dotenv from "dotenv";
import * as request from "request";
import * as zlib from "zlib";

import ProductPricesProvider from "../../domain/products/boundaries/ProductPricesProvider";
import ProductPrices from "../../domain/products/entities/ProductPrices";

dotenv.config();

const nikeMerchantName = "Nike ES";
const acerMerchantName = "Acer ES";
const pcComponentesMerchantName = "PcComponentes ES";

export default class ProductPricesAwinProvider implements ProductPricesProvider {
    public get(): Promise<ProductPrices[]> {
        console.log("Retrieving product prices from awin ...");

        const productPricesDictionary: { [id: string]: ProductPrices; } = {};

        return new Promise((resolve, reject) => {

            const fileUrl = `https://productdata.awin.com/datafeed/download/apikey/${process.env.AWIN_API_KEY}/language/any/fid/${process.env.AWIN_PROGRAMS}/columns/aw_deep_link,aw_product_id,merchant_product_id,merchant_id,merchant_name,search_price,currency,saving,ean,isbn,upc,mpn,product_GTIN,display_price/format/csv/delimiter/%7C/compression/gzip/`;
            console.log(fileUrl);
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

        if (awinProduct.merchant_name === acerMerchantName) {
            storeImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Acer_2011.svg/100px-Acer_2011.svg.png";
        } else if (awinProduct.merchant_name === nikeMerchantName) {
            storeImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/100px-Logo_NIKE.svg.png";
        } else if (awinProduct.merchant_name === pcComponentesMerchantName) {
            storeImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/PcComponentes.png/100px-PcComponentes.png";
        }

        let price: number = 0.0;
        let priceString: string = "";

        if (awinProduct.saving) {
            priceString = awinProduct.saving.replace("EUR", "").trim();
        } else {
            priceString = awinProduct.search_price;
        }

        price = +(+priceString).toFixed(2);

        const ean = this.getEan(awinProduct);
        const upc = this.getUpc(awinProduct);
        const gtin = this.getGtin(awinProduct);

        return {
            _id: gtin ? gtin : ean,
            asin: "",
            ean,
            upc,
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

    private getEan(awinProduct: any) {
        let ean = awinProduct.ean;

        if (awinProduct.ean.includes(";")) {
            ean = awinProduct.ean.split(";")[0];
        }

        if (!ean && awinProduct.merchant_name === nikeMerchantName) {
            ean = awinProduct.merchant_product_id.substring(1, 14);
        }

        return ean;
    }

    private getUpc(awinProduct: any) {
        let upc = awinProduct.upc;

        if (!upc && awinProduct.merchant_name === nikeMerchantName) {
            upc = awinProduct.merchant_product_id;
        }

        return upc;
    }

    private getGtin(awinProduct: any) {
        const gtin = awinProduct.product_GTIN;

        return gtin;
    }
}
