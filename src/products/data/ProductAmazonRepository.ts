
import { OperationHelper } from "apac";
import ProductRepository from "../domain/Boundaries";
import Product from "../domain/Product";

export default class ProductAmazonRepository implements ProductRepository {
    public opHelper: OperationHelper;

    constructor(associateTag: string, accessKey: string, secretAccessKey: string, locale: string) {
        this.opHelper = new OperationHelper({
            assocId: associateTag,
            awsId: accessKey,
            awsSecret: secretAccessKey,
            locale
        });
    }

    public getByAsin(asin: string): Promise<Product> {
        return new Promise((resolve, reject) => {
            this.opHelper.execute("ItemLookup", {
                IdType: "ASIN",
                ItemId: asin,
                ResponseGroup: "ItemAttributes,Offers,Images"
            }).then((response) => {
                const product = this.mapAmazonProduct(response.result.ItemLookupResponse.Items.Item);

                resolve(product);
            }).catch((err) => {
                reject({ message: "An error has ocurred on processing the request" });
            });
        });
    }

    public get(filter: string): Promise<Product[]> {
        if (filter.length === 0) {
            filter = " ";
        }

        return new Promise((resolve, reject) => {
            this.opHelper.execute("ItemSearch", {
                Keywords: filter,
                ResponseGroup: "ItemAttributes,Offers,Images",
                SearchIndex: "All"
            }).then((response) => {
                let products = [];

                if (Array.isArray(response.result.ItemSearchResponse.Items.Item)) {
                    products = response.result.ItemSearchResponse.Items.Item.map((p) => {
                        return this.mapAmazonProduct(p);
                    });
                } else {
                    products.push(this.mapAmazonProduct(response.result.ItemSearchResponse.Items.Item));
                }

                resolve(products);
            }).catch((err) => {
                reject({ message: "An error has ocurred on processing the request" });
            });
        });
    }

    private mapAmazonProduct(p: any) {
        return {
            asin: p.ASIN,
            description: this.mapFeature(p),
            ean: p.ItemAttributes.EAN,
            images: this.mapImages(p),
            name: p.ItemAttributes.Title,
            upc: p.ItemAttributes.UPC,
            url: p.DetailPageURL
        };
    }

    private mapImages(p: any) {
        const images = [];

        if (p.LargeImage) {
            images.push(p.LargeImage.URL);
        } else if (p.MediumImage) {
            images.push(p.MediumImage.URL);
        }

        return images;
    }

    private mapFeature(amzProduct: any) {
        let description = "";

        if (amzProduct.ItemAttributes && amzProduct.ItemAttributes.Feature) {
            if (Array.isArray(amzProduct.ItemAttributes.Feature)) {
                description = amzProduct.ItemAttributes.Feature.join(" ");
            } else {
                description = amzProduct.ItemAttributes.Feature;
            }
        }

        return description;
    }
}
