import { REDACTED } from "../common/constants";
import { Entry } from "../models/harFile";
import { SanitizationRule } from "./sanitizationRule";

const bearerRegex = /Bearer [a-zA-Z0-9.\-_]+/gm;

// Clear out all authorization headers and bearer tokens
export class AuthorizationRequestRule implements SanitizationRule {
    getName(): string {
        return 'authorizationRequestRule';
    }

    isApplicable(requestEntry: Entry): boolean {
        return true;
    }

    sanitize(requestEntry: Entry): void {
        const request = requestEntry.request;
        for (const header of request.headers) {
            if (header.name.toLowerCase() === 'authorization') {
                header.value = REDACTED;
            }
        }

        if (request.postData?.text) {
            request.postData.text = request.postData.text.replace(bearerRegex, REDACTED);
        }
    }
}