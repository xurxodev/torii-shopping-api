import * as hapi from "hapi";
import jwtAuthentication from "../../users/authentication/JwtAuthentication";
import SuggestionRepository from "../data/SuggestionsAmazonRepository";
import GetSuggestionsUseCase from "../domain/usecases/GetSuggestionsUseCase";
import SuggestionsController from "./SuggestionsController";

export default function(): hapi.ServerRoute[] {
  const suggestionRepository = new SuggestionRepository();
  const getSuggestionsUseCase = new GetSuggestionsUseCase(suggestionRepository);
  const suggestionsController = new SuggestionsController(getSuggestionsUseCase);

  return [
    {
      method: "GET",
      path: "/v1/suggestions",
      options: {
        auth: jwtAuthentication.name
      },
      handler: (request: hapi.Request, h: hapi.ResponseToolkit) => {
        return suggestionsController.getSuggestions(request, h);
      }
    }
  ];
}
