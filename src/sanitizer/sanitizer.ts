import { HarFile } from "./models/harFile";
import { ArmBatchResponseRule } from "./requestRules/armBatchResponseRule";
import { ArmPostResponseRule } from "./requestRules/armPostResponseRule";
import { AuthorizationRequestRule } from "./requestRules/authorizationRule";
import { CookiesAndHeadersRule } from "./requestRules/cookiesAndHeadersRule";
import { JSONPutPostRequestRule } from "./requestRules/jsonPutPostRequestRule";
import { JSONResponseRule } from "./requestRules/jsonResponseRule";
import { SanitizationRule } from "./requestRules/sanitizationRule";

export interface SanitizationCategories {
    [key: string]: boolean;

    cookiesAndHeaders: boolean;
    authorizationTokens: boolean;
    armPostResponses: boolean;
    generalJsonResponses: boolean;
    generalJsonPutPostRequests: boolean;
}

export const sanitize = (file: HarFile, categories: SanitizationCategories) => {
    const sanitizationRules = getSanitizationRules(categories);
    for (const entry of file.log.entries) {
        for (const rule of sanitizationRules) {
            try {
                if (rule.isApplicable(entry)) {
                    rule.sanitize(entry);
                }
            } catch (e) {
                console.log(`[${rule.getName()}] Failed to sanitize url: ${entry.request.method} ${entry.request.url}`);
            }
        }
    }
}

const getSanitizationRules = (categories: SanitizationCategories) => {
    const rules: SanitizationRule[] = [];
    for (const category of Object.keys(categories)) {
        if (categories[category]) {
            switch (category) {
                case 'cookiesAndHeaders':
                    rules.push(new CookiesAndHeadersRule());
                    break;
                case 'authorizationTokens':
                    rules.push(new AuthorizationRequestRule());
                    break;
                case 'armPostResponses':
                    rules.push(new ArmPostResponseRule());
                    rules.push(new ArmBatchResponseRule());
                    break;
                case 'generalJsonResponses':
                    rules.push(new JSONResponseRule());
                    break;
                case 'generalJsonPutPostRequests':
                    rules.push(new JSONPutPostRequestRule());
                    break;
                default:
                    throw Error('Unrecognized category');
            }
        }
    }

    for (const rule of rules) {
        console.log(`Added rule: ${rule.getName()}`);
    }

    return rules;
}