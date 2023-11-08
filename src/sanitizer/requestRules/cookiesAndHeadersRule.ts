import { REDACTED, dangerousKeywords } from "../common/constants";
import { Cookie, Entry, NameValueKeyPair } from "../models/harFile";
import { SanitizationRule } from "./sanitizationRule";

export class CookiesAndHeadersRule implements SanitizationRule{
    getName(): string {
        return 'CookiesAndHeadersRule';
    }

    isApplicable(requestEntry: Entry): boolean {
        return true;
    }

    sanitize(requestEntry: Entry): void {
        const {request, response} = requestEntry;

        this._cleanCookieValues(request.cookies);
        this._cleanHeaders(request.headers);

        this._cleanCookieValues(response.cookies);
        this._cleanHeaders(response.headers);
    }

    private _cleanHeaders(headers: NameValueKeyPair[]){
        if(headers){
            const keywords = [...dangerousKeywords, 'cookie', 'set-cookie']
            for(const header of headers){
                for(const keyword of keywords){
                    if(header.name.toLowerCase().indexOf(keyword) > -1){
                        header.value = REDACTED;
                    }
                }
            }
        }
    }

    private _cleanCookieValues(cookies: Cookie[]){
        if(cookies){
            for(const cookie of cookies){
                cookie.value = REDACTED;
            }    
        }
    }
}