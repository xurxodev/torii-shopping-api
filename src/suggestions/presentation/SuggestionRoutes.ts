import * as hapi from "hapi";
import SuggestionRepository from "../data/SuggestionsAmazonRepository";
import GetSuggestionsUseCase from "../domain/usecases/GetSuggestionsUseCase";
import SuggestionsController from "./SuggestionsController";

export default function(): hapi.ServerRoute[] {
  const suggestionRepository = new SuggestionRepository();
  const getSuggestionsUseCase = new GetSuggestionsUseCase(suggestionRepository);
  const suggestionsController = new SuggestionsController(getSuggestionsUseCase);

  const suggestionsHandler = (request: hapi.Request, h: hapi.ResponseToolkit) => {
    return suggestionsController.getSuggestions(request, h);
  };

  return [
    {
      method: "GET",
      path: "/suggestions",
      handler: suggestionsHandler
    },
    {
      method: "GET",
      path: "/v1/suggestions",
      handler: suggestionsHandler
    }
  ];
}
