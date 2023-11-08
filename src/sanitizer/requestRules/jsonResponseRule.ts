import { Entry } from "../models/harFile";
import { MimeType } from "../common/constants";
import { cleanProperties } from "../common/cleanProperties";
import { armHostnamesLowerCase } from "./armPostResponseRule";
import { SanitizationRule } from "./sanitizationRule";

// In general ARM responses should only contain secrets for POST requests.  This
// rule is a best effort to cover everything else that may be returning secrets on other types of requests
// and to non-ARM endpoints.
export class JSONResponseRule implements SanitizationRule {
    getName(): string {
        return 'JSONResponseRule';
    }

    isApplicable(requestEntry: Entry): boolean {
        const { request, response } = requestEntry;

        const parsedUrl = new URL(request.url);
        const parsedHostName = parsedUrl.hostname.toLowerCase();
        const pathName = parsedUrl.pathname.toLowerCase();

        // Batch requests are handled by the armBatchPostResponseRule
        if (armHostnamesLowerCase.findIndex((hostname) => hostname === parsedHostName) > -1 && pathName === '/batch') {
            return false;
        }

        if (response.content.mimeType.toLowerCase() !== MimeType.json) {
            return false;
        }

        return true;
    }

    sanitize(requestEntry: Entry): void {
        const response = requestEntry.response;

        try {
            const content = JSON.parse(response.content.text);
            cleanProperties(content, 'jsonResponseRule');
            response.content.text = JSON.stringify(content);

        } catch (e) {
            console.log('Failed to parse request content' + e);
        }
    }
}