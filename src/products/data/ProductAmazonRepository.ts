
import { OperationHelper } from "apac";
import ProductRepository from "../domain/Boundaries";
import Product from "../domain/entities/Product";
import SearchResult from "../domain/entities/SearchResult";

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
                if (response.result.ItemLookupResponse.Items.Item) {
                    const product = this.mapAmazonProduct(response.result.ItemLookupResponse.Items.Item);
                    resolve(product);
                } else {
                    reject({ message: `Does not exists any product with asin ${asin}` });
                }
            }).catch((err) => {
                reject({ message: "An error has ocurred processing the request" });
            });
        });
    }

    public get(filter: string, page: number = 1, category: string): Promise<SearchResult<Product>> {
        if (filter.length === 0) {
            filter = " ";
        }

        if (category.length === 0) {
            category = "All";
        }

        return new Promise((resolve, reject) => {
            this.opHelper.execute("ItemSearch", {
                ItemPage: page,
                Keywords: filter,
                ResponseGroup: "ItemAttributes,Offers,Images",
                SearchIndex: category
            }).then((response) => {
                const results = {
                    items: [],
                    page,
                    totalPages: 1
                };

                if (response.result.ItemSearchResponse.Items.Item) {
                    if (Array.isArray(response.result.ItemSearchResponse.Items.Item)) {
                        const amzTotalPages = response.result.ItemSearchResponse.Items.TotalPages;

                        results.items =
                            response.result.ItemSearchResponse.Items.Item.map((p) => this.mapAmazonProduct(p));

                        results.totalPages = amzTotalPages > 5 ? 5 : amzTotalPages;

                    } else {
                        results.items.push(this.mapAmazonProduct(response.result.ItemSearchResponse.Items.Item));
                    }
                }

                resolve(results);
            }).catch((err) => {
                reject({ message: "An error has ocurred processing the request" });
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
        } else if (p.ImageSets && p.ImageSets.ImageSet &&
            p.ImageSets.ImageSet.LargeImage && p.ImageSets.ImageSet.LargeImage.URL) {
            images.push(p.ImageSets.ImageSet.LargeImage.URL);
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
