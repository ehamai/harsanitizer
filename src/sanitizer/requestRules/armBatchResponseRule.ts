import { cleanProperties } from "../common/cleanProperties";
import { Entry, Request } from "../models/harFile";
import { armHostnamesLowerCase } from "./armPostResponseRule";
import { REDACTED } from "../common/constants";
import { UberBatchRequest, UberBatchResponse } from "../models/batchRequest";
import { SanitizationRule } from "./sanitizationRule";

export const isBatchRequest = (request: Request) => {
    if (request.method !== 'POST') {
        return false;
    }

    const parsedUrl = new URL(request.url);

    const parsedHostName = parsedUrl.hostname.toLowerCase();
    const pathName = parsedUrl.pathname.toLowerCase();
    return armHostnamesLowerCase.findIndex((hostname) => hostname === parsedHostName) > -1 && pathName === '/batch';
}

// Redacts entire response for POST BATCH requests
// Only redacts keyword properties for non-POST BATCH responses
export class ArmBatchResponseRule implements SanitizationRule {
    getName(): string {
        return 'armBatchResponseRule';
    }

    isApplicable(requestEntry: Entry): boolean {
        const { request, response } = requestEntry;

        if(!isBatchRequest(request)){
            return false;
        }

        if (!response.content) {
            return false;
        }

        return true;
    }

    sanitize(requestEntry: Entry): void {
        const { request, response } = requestEntry;
        if (!request.postData?.text) {
            return;
        }

        const uberBatchRequest: UberBatchRequest = JSON.parse(request.postData.text);
        const uberBatchResponse: UberBatchResponse = JSON.parse(response.content.text);

        for (let i = 0; i < uberBatchRequest.requests.length; i++) {
            const batchRequest = uberBatchRequest.requests[i];
            const batchResponse = uberBatchResponse.responses[i];

            if (batchResponse.httpStatusCode < 200 || batchResponse.httpStatusCode >= 300) {
                continue;
            }

            if (typeof batchResponse.content === 'object') {
                try {
                    // If the request is a POST request, then we redact all JSON properties from the response
                    // If it's not a POST request, then we just redact special keyword properties
                    cleanProperties(batchResponse.content, this.getName(), batchRequest.httpMethod === 'POST' /* cleanAllProperties */);
                } catch (e) {
                    console.log('Failed to clean POST batch response. Redacting entire response');

                    // We err on the side of caution and redact the entire response.
                    batchResponse.content = REDACTED;
                }
            } else{
                // If we can't parse the content then we redact the whole thing to be safe
                batchResponse.content = REDACTED;
            }
        }

        response.content.text = JSON.stringify(uberBatchResponse);

    }
}