import { NameValueKeyPair } from "../models/harFile";
import { REDACTED } from "../sanitizer";

export const authorizationHeaderRule = (kv: NameValueKeyPair) =>{
    if(kv.name.toLowerCase() === 'Authorization'.toLowerCase()){
        kv.value = REDACTED;
    }
}