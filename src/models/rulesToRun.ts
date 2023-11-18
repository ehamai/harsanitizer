export interface RulesToRun {
    [key: string]: boolean;
  
    cookiesAndHeadersRule: boolean;
    authorizationRequestRule: boolean;
    armPostResponseRule: boolean;
    jsonResponseRule: boolean;
    jsonPutPostRequestRule: boolean;
  }