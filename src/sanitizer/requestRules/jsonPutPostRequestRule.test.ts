import exp from "constants";
import { MimeType, REDACTED, dangerousKeywords } from "../common/constants";
import { Entry } from "../models/harFile";
import { JSONPutPostRequestRule } from "./jsonPutPostRequestRule";

test('JSONPutPostRequestRule isApplicable', () =>{
    const rule = new JSONPutPostRequestRule();
    const entry = <Entry>{
        request: {
            method: 'POST',
            url: 'https://management.azure.com',
            postData: {
                mimeType: MimeType.json,
                text: ''
            }
        }
    }

    expect(rule.isApplicable(entry)).toBeTruthy();

    if(entry.request.postData){
        entry.request.postData.mimeType = MimeType.xml;
        expect(rule.isApplicable(entry)).toBeFalsy();
    }

    delete entry.request.postData;
    expect(rule.isApplicable(entry)).toBeFalsy();
})

test('JSONPutPostRequestRule cleans dangerous keyword properties', () =>{
    const rule = new JSONPutPostRequestRule();
    const content: any = {
        safeProperty: 'safeValue'
    }

    for(const keyword of dangerousKeywords){
        content[keyword] = 'secureValue'
    }

    const entry = <Entry>{
        request: {
            method: 'POST',
            url: 'https://management.azure.com',
            postData: {
                mimeType: MimeType.json,
                text: JSON.stringify(content)
            }
        }
    }

    rule.sanitize(entry);
    const outputContent = JSON.parse(entry.request.postData?.text || '');
    expect(outputContent.safeProperty).toEqual('safeValue');

    for(const keyword of dangerousKeywords){
        expect(outputContent[keyword]).toEqual(REDACTED);
    }
})