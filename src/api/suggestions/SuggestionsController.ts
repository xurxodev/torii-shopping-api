
import * as hapi from "hapi";
import GetSuggestionsUseCase from "../../domain/suggestions/usecases/GetSuggestionsUseCase";

export default class SuggestionsController {

    private getSuggestionsUseCase: GetSuggestionsUseCase;

    constructor(getSuggestionsUseCase: GetSuggestionsUseCase) {
        this.getSuggestionsUseCase = getSuggestionsUseCase;
    }

    public getSuggestions(request: hapi.Request, h: hapi.ResponseToolkit): hapi.Lifecycle.ReturnValue {
        let prefix = "";

        if (request.query.prefix) {
            prefix = request.query.prefix.toString();
        }

        return this.getSuggestionsUseCase.execute(prefix);
    }
}
