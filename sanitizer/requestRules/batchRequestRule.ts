import { cleanProperties } from "../common/cleanProperties";
import { UberBatchRequest } from "../models/batchRequest";
import { Request } from "../models/harFile";
import { REDACTED } from "../sanitizer";

var url = require('url');

export const batchRequestRule = (request: Request) =>{
    const parsedUrl = url.parse(request.url);
    if(parsedUrl.pathname === '/batch' && request.method === 'POST'){
        if(!request.postData){
            return;
        }

        try{
            const uberRequest: UberBatchRequest = JSON.parse(request.postData.text);
            if(uberRequest.headers){
                uberRequest.headers['Authorization'] = [REDACTED];
            }

            for(const batchRequest of uberRequest.requests){
                if(batchRequest.httpMethod === 'PUT' || batchRequest.httpMethod === 'POST'){
                    cleanProperties(batchRequest.content, 'batchRequestRule');
                }
            }

        }catch(e){
            console.log('Failed to parse batch content' + e);
        }
    }
}