
import * as dotenv from "dotenv";

import { BulkWriteResult, MongoClient } from "mongodb";
import ProductPricesResository from "../../domain/products/boundaries/ProductPricesResository";
import ProductPrices from "../../domain/products/entities/ProductPrices";

const mongoUrl = process.env.DB_CONNECTION;
const dbName = "toriiShoppingDB";
const PRODUCT_PRICES_COLLECTION = "productPrices";
const IMPORT_SUMMARY_COLLECTION = "importSummary";

dotenv.config();

export default class ProductPricesRepository implements ProductPricesResository {
    public save(productPrices: ProductPrices): Promise<void> {
        return this.saveProductPrices(productPrices)
            .then((result) => this.saveImportSummary(result));
    }

    private saveProductPrices(productPrices: ProductPrices[]): Promise<BulkWriteResult> {
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

    private saveImportSummary(importResult: BulkWriteResult): Promise<void> {

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
                        resolve();
                        client.close();
                    });
            });
        });
    }
}
