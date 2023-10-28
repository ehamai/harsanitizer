import { cleanProperties } from "../common/cleanProperties";
import { Request } from "../models/harFile";

export const jsonPutPostRequestRule = (request: Request) =>{
    if(!request.postData || request.postData.mimeType.toLowerCase() !== 'application/json'.toLowerCase()){
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

