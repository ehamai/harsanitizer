import { cleanProperties } from "../common/cleanProperties";
import { MimeType } from "../common/constants";
import { Entry } from "../models/harFile";
import { REDACTED } from "../sanitizer";
import { SanitizationRule } from "./sanitizationRule";

export const armHostnamesLowerCase = [
    'management.azure.com',
    'management.chinacloudapi.cn',
    'management.usgovcloudapi.net'
];

// POST requests are often used for returning secrets.  For this rule, we aggresively
// sanitize all value data within a response.
export class ArmPostResponseRule implements SanitizationRule {
    getName() {
        return 'ArmPostResponseRule';
    }

    isApplicable(requestEntry: Entry): boolean {
        const { request, response } = requestEntry;

        if (request.method !== 'POST') {
            return false;
        }

        const parsedUrl = new URL(request.url);
        const parsedHostName = parsedUrl.hostname.toLowerCase();
        const pathName = parsedUrl.pathname.toLowerCase();
        if (armHostnamesLowerCase.findIndex((hostname) => hostname === parsedHostName) === -1 ||
            pathName === '/batch' ||
            pathName === '/providers/microsoft.resourcegraph/resources' ||
            response.status < 200 ||
            response.status >= 300) {
            return false;
        }

        return true;
    }

    sanitize(requestEntry: Entry): void {
        const response = requestEntry.response;

        if (!response.content) {
            return;
        } else if (response.content?.mimeType !== MimeType.json) {
            console.log(`[${this.getName()}] Redacting non-JSON response`);
            response.content.text = REDACTED;
        } else {
            try {
                const json = JSON.parse(response.content.text);
                cleanProperties(json, this.getName(), true /* cleanAllProperties */);
                response.content.text = JSON.stringify(json);
            } catch (e) {
                console.log('[armPostResponseRule] - Failed to sanitize text: ' + e);
            }
        }
    }
}