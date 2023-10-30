import { cleanProperties } from "../common/cleanProperties";
import { Entry } from "../models/harFile";
import { REDACTED } from "../sanitizer";
import { armHostnamesLowerCase } from "./armPostResponseRule";
import { MimeType } from "../common/constants";
import { UberBatchRequest, UberBatchResponse } from "../models/batchRequest";
import { SanitizationRule } from "./sanitizationRule";

// Redacts entire response for POST BATCH reqeusts
// Only redacts keyword properties for non-POST BATCH responses
export class ArmBatchResponseRule implements SanitizationRule {
    getName(): string {
        return 'armBatchResponseRule';
    }

    isApplicable(requestEntry: Entry): boolean {
        const { request, response } = requestEntry;

        if (request.method !== 'POST') {
            return false;
        }

        const parsedUrl = new URL(request.url);

        const parsedHostName = parsedUrl.hostname.toLowerCase();
        const pathName = parsedUrl.pathname.toLowerCase();
        if (armHostnamesLowerCase.findIndex((hostname) => hostname === parsedHostName) === -1 || pathName !== '/batch') {
            return false;
        }

        if (!response.content) {
            return false;
        }

        return true;
    }

    sanitize(requestEntry: Entry): void {
        const { request, response } = requestEntry;

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
                        cleanProperties(batchResponse.content, this.getName());
                    } catch (e) {
                        // The response could be non-json.  Since it's not a POST request we are more lenient
                        // to assume that there aren't secrets being returned.
                        console.log('Failed to clean Non-POST batch response');
                    }
                } else {
                    try {
                        cleanProperties(batchResponse.content, this.getName(), true /* cleanAllProperties */);
                    } catch (e) {
                        console.log('Failed to clean POST batch response. Redacting entire response');

                        // If the response is non-json, then we err on the side of caution and redact the entire response.
                        batchResponse.content.text = REDACTED;
                    }
                }
            }

            response.content.text = JSON.stringify(uberBatchResponse);
        }
    }
}