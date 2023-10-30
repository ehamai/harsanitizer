import { cleanProperties } from "../common/cleanProperties";
import { MimeType } from "../common/constants";
import { Entry } from "../models/harFile";
import { REDACTED } from "../sanitizer";
import url = require('url');

// etodo: add in other ARM hostnames
export const armHostnames = ['management.azure.com'];

// POST requests are often used for returning secrets.  For this rule, we aggresively
// sanitize all value data within a response.
export const armPostResponseRule = (requestEntry: Entry) => {
    const { request, response } = requestEntry;

    if (request.method !== 'POST') {
        return;
    }

    const parsedUrl = new URL(request.url);
    const parsedHostName = parsedUrl.hostname.toLowerCase();
    const pathName = parsedUrl.pathname.toLowerCase();
    if (armHostnames.findIndex((hostname) => hostname === parsedHostName) === -1 ||
        pathName === '/batch' ||
        pathName === '/providers/microsoft.resourcegraph/resources') {
        return;
    }

    if(!response.content){
        return;
    }else if(response.content?.mimeType !== MimeType.json){
        console.log('[armPostResponseRule] Redacting non-JSON response');
        response.content.text = REDACTED;
    } else{
        try{
            const json = JSON.parse(response.content.text);
            cleanProperties(json, 'armPostResponseRule', true /* cleanAllProperties */);
            response.content.text = JSON.stringify(json);
        }catch(e){
            console.log('[armPostResponseRule] - Failed to sanitize text: ' + e);
        }
    }
}