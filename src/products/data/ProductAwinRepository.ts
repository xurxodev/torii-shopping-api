import * as csv from "csv-parser";
import * as fs from "fs";
import * as path from "path";
import Product from "../domain/entities/Product";
import ProductRepository from "../domain/repositories/ProductRepository";

import * as request from "request";
import * as zlib from "zlib";
import SearchResult from "../domain/entities/SearchResult";

export default class ProductAwinRepository implements ProductRepository {
    public results = {
        items: [],
        page: 1,
        totalPages: 1
    };

    constructor() {

        /*
        const filePath = path.join(__dirname, "awin.csv");
        fs.createReadStream(filePath)
            .pipe(csv({ separator: "|" }))
            .on("data", (data) => {
                this.products.push(data);
            })
            .on("end", () => {
                console.log(this.products.length);
            });
            */

        const fileUrl = "https://productdata.awin.com//datafeed/download/apikey/75210c69ad31f48c6d23bbaff75d78ec/language/es/fid/33799/columns/aw_deep_link,product_name,aw_product_id,merchant_product_id,merchant_image_url,description,merchant_category,search_price,merchant_name,merchant_id,category_name,category_id,aw_image_url,currency,store_price,delivery_cost,merchant_deep_link,language,last_updated,display_price,data_feed_id,ean,isbn,upc,mpn,parent_product_id,product_GTIN,merchant_thumb_url,large_image,alternate_image,aw_thumb_url,alternate_image_two,alternate_image_three,alternate_image_four/format/csv/delimiter/%7C/compression/gzip/adultcontent/1/";

        const gunzip = zlib.createGunzip();

        request.get({ url: fileUrl, gzip: true})
            .pipe(gunzip)
            .pipe(csv({ separator: "|" }))
            .on("data", (data) => {
                this.results.items.push(data);
            })
            .on("end", () => {
                console.log(this.results.items.length);
            });
    }

    public getByAsin(asin: string): Promise<Product> {
        const product = this.results.items.find((p) => p.asin === asin);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (product) {
                    resolve(product);
                } else {
                    reject(`Does not exist a product with asin ${asin}`);
                }
            }, 250);
        });
    }

    public get(filter: string): Promise<SearchResult<Product>> {
        return new Promise((resolve, reject) => {
            let queryProducts = this.results.items;

            setTimeout(() => {
                if (filter) {
                    queryProducts = this.results.items.filter((p) => {
                        return p.product_name &&
                            (p.product_name.toLowerCase().includes(filter.toLowerCase()) || !filter);
                    });
                }

                this.results.items = queryProducts.slice(0, 25)
                .map((p) => {
                    return {
                        asin: "",
                        description: p.description,
                        ean: p.product_GTIN,
                        images: [p.merchant_image_url, p.large_image, p.alternate_image, p.alternate_image_two],
                        name: p.product_name,
                        upc: p.upc,
                        url: p.aw_deep_link
                    };
                });

                resolve(this.results);
            }, 250);
        });
    }
}
