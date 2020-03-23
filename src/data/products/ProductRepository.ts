import * as MongoClient from "mongodb";
import * as ProductAdvertisingAPIv1 from "paapi5-nodejs-sdk";

import ProductRepository from "../../domain/products/boundaries/ProductRepository";
import Product from "../../domain/products/entities/Product";
import ProductPrice from "../../domain/products/entities/ProductPrice";
import SearchResult from "../../domain/products/entities/SearchResult";

const mongoUrl = process.env.DB_CONNECTION;

export default class ProductAmazonRepository implements ProductRepository {
    private associateTag: string;
    private amzApi: any;

    constructor(
        associateTag: string,
        accessKey: string,
        secretAccessKey: string,
        host: string,
        region: string) {

        this.associateTag = associateTag;

        const defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;

        defaultClient.accessKey = accessKey;
        defaultClient.secretKey = secretAccessKey;
        defaultClient.host = host;
        defaultClient.region = region;

        this.amzApi = new ProductAdvertisingAPIv1.DefaultApi();
    }

    public get(filter: string, page: number = 1, category: string): Promise<SearchResult<Product>> {
        if (category.length === 0) {
            category = "All";
        }

        return new Promise((resolve, reject) => {
            const searchItemsRequest = new ProductAdvertisingAPIv1.SearchItemsRequest();

            searchItemsRequest.PartnerTag = this.associateTag;
            searchItemsRequest.PartnerType = "Associates";

            if (filter) {
                searchItemsRequest.Keywords = filter;
            }

            searchItemsRequest.SearchIndex = category;
            searchItemsRequest.ItemPage = page;
            searchItemsRequest.Resources = [
                "CustomerReviews.Count",
                "CustomerReviews.StarRating",
                "Images.Primary.Medium",
                "Images.Primary.Large",
                "Images.Variants.Medium",
                "Images.Variants.Large",
                "ItemInfo.ExternalIds",
                "ItemInfo.Features",
                "ItemInfo.Title",
                "ItemInfo.TradeInInfo",
                "Offers.Listings.Price"
            ];

            const results = {
                items: [],
                page,
                totalPages: 1
            };

            try {
                this.amzApi.searchItems(searchItemsRequest, (error, data, response) => {
                    if (error) {
                        console.log("Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

                        reject({ message: "An error has ocurred processing the request" });
                    } else {
                        const searchItemsResponse =
                            ProductAdvertisingAPIv1.SearchItemsResponse.constructFromObject(data);

                        if (searchItemsResponse.SearchResult !== undefined) {

                            const amzTotalPages = searchItemsResponse.SearchResult.TotalResultCount / 10;

                            results.items =
                                searchItemsResponse.SearchResult.Items.map((p) => this.mapAmazonProduct(p));

                            results.totalPages = amzTotalPages > 10 ? 10 : amzTotalPages;

                            results.items = results.items.map((p) => {
                                const prices = this.formatPrices(p.prices);

                                return { ...p, prices };
                            });

                            resolve(results);
                        } else {
                            reject({ message: "An error has ocurred processing the request" });
                            console.log("Complete Error Response: " +
                                JSON.stringify(searchItemsResponse.Errors, null, 1));
                        }
                    }
                });
            } catch (ex) {
                reject({ message: "An error has ocurred processing the request" });
            }
        });
    }

    public getByAsin(asin: string): Promise<Product> {
        return new Promise((resolve, reject) => {
            const getItemsRequest = new ProductAdvertisingAPIv1.GetItemsRequest();

            getItemsRequest.PartnerTag = this.associateTag;
            getItemsRequest.PartnerType = "Associates";
            getItemsRequest.ItemIds = [asin];
            getItemsRequest.Condition = "New";
            getItemsRequest.Resources = [
                "CustomerReviews.Count",
                "CustomerReviews.StarRating",
                "Images.Primary.Medium",
                "Images.Primary.Large",
                "Images.Variants.Medium",
                "Images.Variants.Large",
                "ItemInfo.ExternalIds",
                "ItemInfo.Features",
                "ItemInfo.Title",
                "ItemInfo.TradeInInfo",
                "Offers.Listings.Price"
            ];

            try {
                this.amzApi.getItems(getItemsRequest, (error, data, response) => {
                    if (error) {
                        console.log("Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

                        reject({ message: "An error has ocurred processing the request" });
                    } else {
                        const getItemsResponse =
                            ProductAdvertisingAPIv1.GetItemsResponse.constructFromObject(data);

                        if (getItemsResponse.ItemsResult !== undefined &&
                            getItemsResponse.ItemsResult.Items !== undefined &&
                            getItemsResponse.ItemsResult.Items.length > 0) {

                            const product = this.mapAmazonProduct(getItemsResponse.ItemsResult.Items[0]);

                            this.getOtherPrices(product.ean)
                                .then((prices) => {
                                    if (prices) {
                                        product.prices.push(...prices);

                                        product.prices = product.prices.sort((a, b) => {
                                            return a.price - b.price;
                                        });
                                    }

                                    product.prices = this.formatPrices(product.prices);

                                    resolve(product);
                                }).catch((err) => resolve(product));
                        } else {
                            reject({ message: `Does not exists any product with asin ${asin}` });
                        }
                    }
                });
            } catch (ex) {
                reject({ message: "An error has ocurred processing the request" });
            }
        });
    }

    private mapAmazonProduct(amzProduct: any) {
        const product = {
            asin: amzProduct?.ASIN,
            description: this.mapFeature(amzProduct),
            ean: amzProduct?.ItemInfo?.ExternalIds?.EANs?.DisplayValues[0],
            images: this.mapImages(amzProduct),
            name: amzProduct?.ItemInfo?.Title?.DisplayValue,
            upc: amzProduct?.ItemInfo?.ExternalIds?.UPCs?.DisplayValues[0],
            url: amzProduct.DetailPageURL,
            prices: []
        };
        let currency = "";
        let amount = 0.0;

        if (amzProduct.Offers !== undefined && amzProduct.Offers.Listings !== undefined
            && amzProduct.Offers.Listings[0].Price !== undefined
            && amzProduct.Offers.Listings[0].Price.DisplayAmount !== undefined) {
            currency = amzProduct.Offers.Listings[0].Price.Currency;
            amount = amzProduct.Offers.Listings[0].Price.Amount;
        }

        const price = {
            store: "Amazon",
            storeImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/100px-Amazon_logo.svg.png",
            url: amzProduct.DetailPageURL,
            price: amount,
            currency
        };

        product.prices.push(price);

        return product;
    }

    private mapImages(amzProduct: any) {
        const images = [];

        if (amzProduct.Images && amzProduct.Images.Primary) {
            if (amzProduct.Images.Primary.Large) {
                images.push(amzProduct.Images.Primary.Large.URL);
            } else if (amzProduct.Images.Primary.Medium) {
                images.push(amzProduct.Images.Primary.Medium.URL);
            }
        }

        if (amzProduct.Images && amzProduct.Images.Variants) {
            amzProduct.Images.Variants.forEach((imageSet) => {
                if (imageSet.Large) {
                    images.push(imageSet.Large.URL);
                } else if (imageSet.Medium) {
                    images.push(imageSet.Medium.URL);
                }
            });
        }

        return Array.from(new Set(images));
    }

    private mapFeature(amzProduct: any) {
        let description = "";

        if (amzProduct.ItemInfo && amzProduct.ItemInfo.Features &&
            amzProduct.ItemInfo.Features.DisplayValues) {
            description = amzProduct.ItemInfo.Features.DisplayValues.join(" ");
        }

        return description;
    }

    private getOtherPrices(id: string): Promise<ProductPrice[]> {

        return new Promise((resolve, reject) => {
            let productPrices: ProductPrice[];

            const dbName = "toriiShoppingDB";

            // Create a new MongoClient
            const mongoClient = new MongoClient.MongoClient(mongoUrl, { useUnifiedTopology: true });

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

    private formatPrices(productPrices: any[]) {
        return productPrices.map((pp) => {
            return { ...pp, price: this.formatPrice(pp.price) };
        });
    }

    private formatPrice(price: number) {
        let formattedPrice = "";
        if (price > 0) {
            formattedPrice = price.toFixed(2).replace(".", ",");
        }
        return formattedPrice;
    }
}
