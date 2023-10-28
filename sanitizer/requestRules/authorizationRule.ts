import { Request } from "../models/harFile";
import { REDACTED } from "../sanitizer";

const bearerRegex = /Bearer [a-zA-Z0-9.\-_]+/gm;

export const authorizationRequestRule = (request: Request) =>{
    for(const header of request.headers){
        if(header.name.toLowerCase() === 'authorization'){
            header.value = REDACTED;
        }
    }

    if(request.postData?.text){
        request.postData.text = request.postData.text.replace(bearerRegex, REDACTED);
    }
}
