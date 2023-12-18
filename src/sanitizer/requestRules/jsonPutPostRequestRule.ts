import { cleanProperties } from "../common/cleanProperties";
import { MimeType } from "../common/constants";
import { Entry } from "../models/harFile";
import { SanitizationRule } from "./sanitizationRule";

// Makes a best effort to clean dangerous keyword properties from request bodies
export class JSONPutPostRequestRule implements SanitizationRule {
    getName(): string {
        return 'jsonPutPostRequestRule';
    }

    isApplicable(requestEntry: Entry): boolean {
        const request = requestEntry.request;
        if (!request.postData || request.postData.mimeType.toLowerCase() !== MimeType.json) {
            return false;
        }

        return true;
    }

    sanitize(requestEntry: Entry): void {
        const request = requestEntry.request;
        if(!request.postData){
            return;
        }

        try {
            const content = JSON.parse(request.postData.text);
            cleanProperties(content, this.getName());
            request.postData.text = JSON.stringify(content);
        } catch (e) {
            console.log('Failed to parse request content' + e);

            throw e;
        }
    }
}