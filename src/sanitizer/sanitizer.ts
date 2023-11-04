import { HarFile } from "./models/harFile";
import { ArmBatchResponseRule } from "./requestRules/armBatchResponseRule";
import { ArmPostResponseRule } from "./requestRules/armPostResponseRule";
import { AuthorizationRequestRule } from "./requestRules/authorizationRule";
import { CookiesAndHeadersRule } from "./requestRules/cookiesAndHeadersRule";
import { JSONPutPostRequestRule } from "./requestRules/jsonPutPostRequestRule";
import { JSONResponseRule } from "./requestRules/jsonResponseRule";
import { SanitizationRule } from "./requestRules/sanitizationRule";

export const REDACTED = '___REDACTED___';

const sanitizationRules: SanitizationRule[] = [
    new CookiesAndHeadersRule(),
    new AuthorizationRequestRule(),
    new ArmBatchResponseRule(),
    new ArmPostResponseRule(),
    new JSONPutPostRequestRule(),
    new JSONResponseRule()
]

export const sanitize = (file: HarFile) =>{
    for(const entry of file.log.entries){
        for(const rule of sanitizationRules){
            try{
                if(rule.isApplicable(entry)){
                    rule.sanitize(entry);
                }
            } catch(e){
                console.log(`[${rule.getName()}] Failed to sanitize url: ${entry.request.method} ${entry.request.url}`);
            }
        }
    }
}

