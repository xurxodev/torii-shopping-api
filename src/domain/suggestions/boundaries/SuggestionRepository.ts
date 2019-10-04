import { Suggestion } from "../entities/Suggestion";

export default interface SuggestionRepository<> {
    get(prefix: string): Promise<Suggestion[]>;
}
