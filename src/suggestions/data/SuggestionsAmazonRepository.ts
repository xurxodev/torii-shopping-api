import fetch from "node-fetch";
import SuggestionRepository from "../domain/Boundaries";
import { Suggestion, SuggestionCategory } from "../domain/Suggestion";

export default class SuggestionsAmazonRepository implements SuggestionRepository {

    public get(prefix: string): Promise<Suggestion[]> {
        return new Promise((resolve, reject) => {
            fetch(`https://completion.amazon.co.uk/api/2017/suggestions?mid=A1RKKUPIHCS9HS&alias=aps&prefix=${prefix}`)
                .then((response) => response.json())
                .then((resJson: any) => {
                    const suggestions = resJson.suggestions.map((sug: any) => {
                        return {
                            categories: sug.scopes ? sug.scopes.map((scope: any) => {
                                return {
                                    display: scope.display,
                                    value: scope.value
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
