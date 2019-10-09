
import { OperationHelper } from "apac";
import * as MongoClient from "mongodb";

import ProductRepository from "../../domain/products/boundaries/ProductRepository";
import Product from "../../domain/products/entities/Product";
import ProductPrice from "../../domain/products/entities/ProductPrice";
import SearchResult from "../../domain/products/entities/SearchResult";

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

                    this.getOtherPrices(product.ean)
                        .then((prices) => {
                            product.prices.push(...prices);
                            resolve(product);
                        }).catch((err) => resolve(product));
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

                        results.totalPages = +amzTotalPages > 5 ? 5 : +amzTotalPages;

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
        const product = {
            asin: p.ASIN,
            description: this.mapFeature(p),
            ean: p.ItemAttributes.EAN,
            images: this.mapImages(p),
            name: p.ItemAttributes.Title,
            upc: p.ItemAttributes.UPC,
            url: p.DetailPageURL,
            prices: []
        };

        if (p.Offers && p.Offers.Offer && p.Offers.Offer.OfferListing &&
            p.Offers.Offer.OfferListing.Price) {
            const currency = p.Offers.Offer.OfferListing.Price.CurrencyCode;
            const formattedPrice = p.Offers.Offer.OfferListing.Price.FormattedPrice;
            const amount = formattedPrice.replace(currency, "").trim();

            const price = {
                store: "Amazon",
                storeImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/100px-Amazon_logo.svg.png",
                url: p.DetailPageURL,
                price: amount,
                currency
            };

            product.prices.push(price);
        }

        return product;
    }

    private mapImages(p: any) {
        const images = [];

        if (p.ImageSets && p.ImageSets.ImageSet && Array.isArray(p.ImageSets.ImageSet)) {
            p.ImageSets.ImageSet.forEach((imageSet) => {
                images.push(imageSet.LargeImage.URL);
            });
        } else if (p.ImageSets && p.ImageSets.ImageSet && p.ImageSets.ImageSet.LargeImage) {
            images.push(p.ImageSets.ImageSet.LargeImage.URL);
        } else if (p.LargeImage) {
            images.push(p.LargeImage.URL);
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

    private getOtherPrices(id: string): Promise<ProductPrice[]> {

        return new Promise((resolve, reject) => {
            let productPrices: ProductPrice[];

            const url = "mongodb+srv://xurxodev:HQqRTif8jRDTFvNz@cluster0-lctpr.mongodb.net/test?retryWrites=true&w=majority";
            const dbName = "toriiShoppingDB";

            // Create a new MongoClient
            const mongoClient = new MongoClient.MongoClient(url, { useUnifiedTopology: true });

            // Use connect method to connect to the Server
            mongoClient.connect((errCon, client) => {
                if (errCon) { reject(errCon); }

                const db = client.db(dbName);

                // Insert a single document
                db.collection("productPrices").findOne({ _id: id }, (err, r) => {
                    if (err) { reject(err); }

                    if (r) {
                        productPrices = r.prices;
                    }

                    resolve(productPrices);
                    client.close();
                });
            });
        });
    }
}
