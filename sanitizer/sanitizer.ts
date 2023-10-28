import { authorizationHeaderRule } from "./headerRules/authorizationHeaderRule";
import { HarFile, NameValueKeyPair, Request } from "./models/harFile";
import { authorizationRequestRule } from "./requestRules/authorizationRule";
import { batchRequestRule } from "./requestRules/batchRequestRule";
import { jsonPutPostRequestRule } from "./requestRules/jsonPutPostRequestRule";

export const REDACTED = '___REDACTED___';

const headerRules: ((kv: NameValueKeyPair) => void)[] = [
    // authorizationHeaderRule
]

const requestRules: ((request: Request) => void)[] = [
    authorizationRequestRule,
    jsonPutPostRequestRule,
    // batchRequestRule
]

export const sanitize = (file: HarFile) =>{
    for(const entry of file.log.entries){
        for(const rule of requestRules){
            rule(entry.request);
        }
    }
}

