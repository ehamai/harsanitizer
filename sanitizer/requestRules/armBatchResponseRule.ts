import { cleanProperties } from "../common/cleanProperties";
import { Entry } from "../models/harFile";
import { REDACTED } from "../sanitizer";
import { armHostnames } from "./armPostResponseRule";
import { MimeType } from "../common/constants";
import { UberBatchRequest, UberBatchResponse } from "../models/batchRequest";

// Redacts entire response for POST BATCH reqeusts
// Only redacts keyword properties for non-POST BATCH responses
export const armBatchResponseRule = (requestEntry: Entry) => {
    const { request, response } = requestEntry;

    if (request.method !== 'POST') {
        return;
    }

    const parsedUrl = new URL(request.url);

    const parsedHostName = parsedUrl.hostname.toLowerCase();
    const pathName = parsedUrl.pathname.toLowerCase();
    if (armHostnames.findIndex((hostname) => hostname === parsedHostName) === -1 || pathName !== '/batch') {
        return;
    }

    if (!response.content) {
        return;
    }

    if (response.content.mimeType !== MimeType.json) {
        response.content.text = REDACTED;
    } else {
        const uberBatchRequest: UberBatchRequest = JSON.parse(request.postData.text);
        const uberBatchResponse: UberBatchResponse = JSON.parse(response.content.text);

        for (let i = 0; i < uberBatchRequest.requests.length; i++) {
            const batchRequest = uberBatchRequest.requests[i];
            const batchResponse = uberBatchResponse.responses[i];

            if (batchRequest.httpMethod !== 'POST') {
                try {
                    cleanProperties(batchResponse.content, 'armBatchPostResponseRule');
                } catch (e) {
                    console.log('Failed to clean Non-POST batch response');
                }
            } else{
                try {
                    cleanProperties(batchResponse.content, 'armBatchPostResponseRule', true /* cleanAllProperties */);
                } catch (e) {
                    console.log('Failed to clean POST batch response. Redacting entire response');
                    batchResponse.content.text = REDACTED;
                }
            }
        }

        response.content.text = JSON.stringify(uberBatchResponse);
    }
}