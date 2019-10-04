export interface Suggestion {
    categories: SuggestionCategory[];
    value: string;
}

export interface SuggestionCategory {
    display: string;
    value: string;
}
