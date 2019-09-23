import fetch from "node-fetch";
import SuggestionRepository from "../domain/Boundaries";
import { Suggestion, SuggestionCategory } from "../domain/Suggestion";

export default class SuggestionsAmazonRepository implements SuggestionRepository {
    public categories = [
        {
            alias: "grocery",
            searchIndex: "Grocery"
        },
        {
            alias: "mobile-apps",
            searchIndex: "MobileApps"
        }, {
            alias: "baby",
            searchIndex: "Baby"
        },
        {
            alias: "beauty",
            searchIndex: "Beauty"
        },
        {
            alias: "diy",
            searchIndex: "Tools"
        },
        {
            alias: "gift-cards",
            searchIndex: "GiftCards"
        },
        {
            alias: "automotive",
            searchIndex: "Automotive"
        },
        {
            alias: "sporting",
            searchIndex: "SportingGoods"
        },
        {
            alias: "electronics",
            searchIndex: "Electronics"
        },
        {
            alias: "luggage",
            searchIndex: "Luggage"
        },
        {
            alias: "handmade",
            searchIndex: "Handmade"
        },
        {
            alias: "kitchen",
            searchIndex: "Kitchen"
        },
        {
            alias: "lighting",
            searchIndex: "Lighting"
        },
        {
            alias: "industrial",
            searchIndex: "Industrial"
        },
        {
            alias: "computers",
            searchIndex: "PCHardware"
        },
        {
            alias: "mi",
            searchIndex: "MusicalInstruments"
        },
        {
            alias: "lawngarden",
            searchIndex: "LawnAndGarden"
        },
        {
            alias: "jewelry",
            searchIndex: "Jewelry"
        },
        {
            alias: "toys",
            searchIndex: "Toys"
        },
        {
            alias: "stripbooks",
            searchIndex: "Books"
        },
        {
            alias: "digital-music",
            searchIndex: "MP3Downloads"
        },
        {
            alias: "office-products",
            searchIndex: "OfficeProducts"
        },
        {
            alias: "dvd",
            searchIndex: "DVD",
        },
        {
            alias: "watches",
            searchIndex: "Watches"
        },
        {
            alias: "apparel",
            searchIndex: "Apparel"
        },
        {
            alias: "hpc",
            searchIndex: "HealthPersonalCare"
        },
        {
            alias: "software",
            searchIndex: "Software"
        },
        {
            alias: "digital-text",
            searchIndex: "KindleStore"
        },
        {
            alias: "videogames",
            searchIndex: "VideoGames"
        },
        {
            alias: "shoes",
            searchIndex: "Shoes"
        }
    ];

    public get(prefix: string): Promise<Suggestion[]> {
        return new Promise((resolve, reject) => {
            fetch(`https://completion.amazon.co.uk/api/2017/suggestions?mid=A1RKKUPIHCS9HS&alias=aps&prefix=${prefix}`)
                .then((response) => response.json())
                .then((resJson: any) => {
                    const suggestions = resJson.suggestions.map((sug: any) => {
                        let scopes = [];

                        if (sug.scopes) {
                            scopes = scopes.filter((sco) => this.categories.find((cat) => cat.alias === sco.alias));
                        }

                        return {
                            categories: sug.scopes ? sug.scopes.map((scope: any) => {

                                const searchIndex = this.categories.find((c) => c.alias === scope.value).searchIndex;

                                return {
                                    display: scope.display,
                                    value: searchIndex
                                };
                            }) : [],
                            value: sug.value
                        };
                    });

                    resolve(suggestions);
                }).catch((error) => {
                    reject(error);
                });
        });
    }
}
