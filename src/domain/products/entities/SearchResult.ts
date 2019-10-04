interface SearchResult<T> {
    items: T[];
    page: number;
    totalPages: number;
}

export default SearchResult;
