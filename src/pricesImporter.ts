import * as csv from "csv-parser";
import * as dotenv from "dotenv";
import { BulkWriteResult, MongoClient } from "mongodb";
import * as request from "request";
import * as zlib from "zlib";
import ProductPrice from "./domain/products/entities/ProductPrice";

dotenv.config();

const mongoUrl = process.env.DB_CONNECTION;
const dbName = "toriiShoppingDB";
const PRODUCT_PRICES_COLLECTION = "productPrices";
const IMPORT_SUMMARY_COLLECTION = "importSummary";

interface ProducPrices {
    _id: string;
    asin: string;
    ean: string;
    upc: string;
    isbn: string;
    prices: ProductPrice[];
}

function execute() {
    getProductsPricesFromAwin()
        .then((productPrices) => saveProductPrices(productPrices))
        .then((result) => saveImportSummary(result))
        .catch((error) => console.log(error));
}

function getProductsPricesFromAwin(): Promise<ProducPrices[]> {
    console.log("Retrieving product prices from awin ...");

    const productPricesDictionary: { [id: string]: ProducPrices; } = {};

    return new Promise((resolve, reject) => {

        const fileUrl = `https://productdata.awin.com/datafeed/download/apikey/${process.env.AWIN_API_KEY}/language/any/fid/${process.env.AWIN_PROGRAMS}/columns/aw_deep_link,aw_product_id,merchant_product_id,merchant_id,merchant_name,search_price,currency,ean,isbn,upc,mpn,product_GTIN,display_price/format/csv/delimiter/%7C/compression/gzip/`;

        const gunzip = zlib.createGunzip();

        request.get({ url: fileUrl, gzip: true })
            .pipe(gunzip)
            .pipe(csv({ separator: "|" }))
            .on("data", (data) => {
                const product = parseProduct(data);

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
                const productPrices: ProducPrices[] = Object.values(productPricesDictionary);
                resolve(productPrices);
                console.log(`Retrieved product prices from awin, num products:${productPrices.length}`);
            })
            .on("error", (e) => {
                console.log(e);
            });
    });
}

function parseProduct(awinProduct: any): any {
    let storeImage = `https://ui2.awin.com/logos/${awinProduct.merchant_id}/logo.gif`;

    if (awinProduct.merchant_name === "Acer ES") {
        storeImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Acer_2011.svg/100px-Acer_2011.svg.png";
    }

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
                price: (+awinProduct.search_price).toFixed(2).replace(".", ","),
                currency: awinProduct.currency
            }
        ]
    };
}

function saveProductPrices(productPrices: ProducPrices[]): Promise<BulkWriteResult> {
    console.log(`Saving ${productPrices.length} product prices to database ...`);

    return new Promise((resolve, reject) => {
        // Create a new MongoClient
        const mongoClient = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

        // Use connect method to connect to the Server
        mongoClient.connect((errCon, client) => {
            if (errCon) { reject(errCon); }

            const db = client.db(dbName);

            console.log(`   dropping current product prices...`);
            const col = db.collection(PRODUCT_PRICES_COLLECTION);

            col.drop((delErr, delOK) => {
                if (delErr) {
                    client.close();
                    reject(delErr);
                    console.log(delErr);
                }

                if (delOK) {
                    console.log(`   saving retrieved product prices...`);
                    // Initialize the Ordered Batch
                    // You can use initializeUnorderedBulkOp to initialize Unordered Batch
                    const batch = col.initializeUnorderedBulkOp();

                    productPrices.forEach((p) => batch.insert(p));

                    // Execute the operations
                    batch.execute((batchErr, batchResult) => {
                        if (batchErr) {
                            client.close();
                            reject(batchErr);
                            console.log(batchErr);
                        }

                        console.log(`Saved product prices to database`);
                        resolve(batchResult);
                        client.close();
                    });
                }
            });
        });
    });
}

function saveImportSummary(importResult: BulkWriteResult) {

    return new Promise((resolve, reject) => {
        // Create a new MongoClient
        const mongoClient = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

        // Use connect method to connect to the Server
        mongoClient.connect((errCon, client) => {
            if (errCon) { reject(errCon); }

            const db = client.db(dbName);

            console.log(`Saving import summary...`);

            const col = db.collection(IMPORT_SUMMARY_COLLECTION);

            const identifier = "import_sumary";

            col.replaceOne({ _id: identifier }, {
                _id: identifier,
                ok: importResult.ok,
                writeErrors: importResult.getWriteErrors(),
                writeConcernErrors: importResult.getWriteConcernError(),
                nInserted: importResult.nInserted,
                nUpserted: importResult.nUpserted,
                nModified: importResult.nModified,
                nRemoved: importResult.nRemoved,
                lastOp: importResult.getLastOp()
            }, { upsert: true },
                (err, summaryResult) => {
                    if (err) {
                        reject(err);
                        console.log(err);
                    }

                    console.log(`Saved import summary:${summaryResult}`);
                    resolve(summaryResult);
                    client.close();
                });
        });
    });
}

execute();
