import { Suggestion } from "./Suggestion";

export default interface SuggestionRepository<> {
    get(prefix: string): Promise<Suggestion[]>;
}
