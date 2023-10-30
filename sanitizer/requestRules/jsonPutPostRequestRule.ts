import { cleanProperties } from "../common/cleanProperties";
import { MimeType } from "../common/constants";
import { Entry } from "../models/harFile";

export const jsonPutPostRequestRule = (requestEntry: Entry) =>{
    const request = requestEntry.request;
    if(!request.postData || request.postData.mimeType.toLowerCase() !== MimeType.json){
        return;
    }

    try{
        const content = JSON.parse(request.postData.text);
        cleanProperties(content, 'jsonPutPostRequestRule');
        request.postData.text = JSON.stringify(content);

    } catch(e){
        console.log('Failed to parse request content' + e);
    }
}

