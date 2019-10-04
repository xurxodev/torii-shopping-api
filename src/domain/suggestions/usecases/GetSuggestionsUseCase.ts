import SuggestionRepository from "../boundaries/SuggestionRepository";
import { Suggestion } from "../entities/Suggestion";

export default class GetSuggestionsUseCase {
    private repository: SuggestionRepository;

    constructor(resository: SuggestionRepository) {
        this.repository = resository;
    }

    public execute(prefix: string): Promise<Suggestion[]>  {
        return this.repository.get(prefix);
    }
}
