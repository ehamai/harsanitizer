import { MimeType, REDACTED, dangerousKeywords } from "../common/constants";
import { Entry } from "../models/harFile";
import { JSONResponseRule } from "./jsonResponseRule"

test('JSONResponseRule is not applicable for batch requests', () =>{
    const rule = new JSONResponseRule();
    const entry = <Entry>{
        request: {
            method: 'POST',
            url: 'https://management.azure.com/batch'
        }
    }

    expect(rule.isApplicable(entry)).toBeFalsy();
})

test('JSONResponseRule is not applicable for non JSON response types', () =>{
    const rule = new JSONResponseRule();
    const entry = <Entry>{
        request: {
            method: 'POST',
            url: 'https://management.azure.com/somePath'
        },
        response: {
            content: {
                mimeType: MimeType.xml
            }
        }
    }

    expect(rule.isApplicable(entry)).toBeFalsy();
})

test('JSONResponseRule is applicable for JSON response types', () =>{
    const rule = new JSONResponseRule();
    const entry = <Entry>{
        request: {
            method: 'POST',
            url: 'https://management.azure.com/somePath'
        },
        response: {
            content: {
                mimeType: MimeType.json
            }
        }
    }

    expect(rule.isApplicable(entry)).toBeTruthy();
})

test('JSONResponseRule is applicable for JSON response types', () =>{
    const rule = new JSONResponseRule();
    const content: any = {
        safeProperty: 'safeValue'
    }

    for(const keyword of dangerousKeywords){
        content[keyword] = 'secureValue'
    }

    const entry = <Entry>{
        request: {
            method: 'POST',
            url: 'https://management.azure.com/somePath'
        },
        response: {
            content: {
                mimeType: MimeType.json,
                text: JSON.stringify(content)
            }
        }
    }

    rule.sanitize(entry);
    const outputContent = JSON.parse(entry.response.content.text);
    expect(outputContent.safeProperty).toEqual('safeValue');
    for(const keyword of dangerousKeywords){
        expect(outputContent[keyword]).toEqual(REDACTED);
    }
})