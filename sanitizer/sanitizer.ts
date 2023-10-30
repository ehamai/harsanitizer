import { authorizationHeaderRule } from "./headerRules/authorizationHeaderRule";
import { Entry, HarFile, NameValueKeyPair, Request } from "./models/harFile";
import { armBatchResponseRule } from "./requestRules/armBatchResponseRule";
import { armPostResponseRule } from "./requestRules/armPostResponseRule";
import { authorizationRequestRule } from "./requestRules/authorizationRule";
import { jsonPutPostRequestRule } from "./requestRules/jsonPutPostRequestRule";
import { jsonResponseRule } from "./requestRules/jsonResponseRule";

export const REDACTED = '___REDACTED___';

const headerRules: ((kv: NameValueKeyPair) => void)[] = [
    // authorizationHeaderRule
]

const requestRules: ((requestEntry: Entry) => void)[] = [
    authorizationRequestRule,
    jsonPutPostRequestRule,
    armPostResponseRule,
    armBatchResponseRule,
    jsonResponseRule
]

export const sanitize = (file: HarFile) =>{
    for(const entry of file.log.entries){
        for(const rule of requestRules){
            rule(entry);
        }
    }
}

