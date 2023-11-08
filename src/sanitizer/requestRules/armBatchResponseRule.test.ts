import { MimeType, REDACTED } from "../common/constants";
import { UberBatchRequest, UberBatchResponse } from "../models/batchRequest";
import { Entry } from "../models/harFile"
import { ArmBatchResponseRule } from "./armBatchResponseRule"
import { armHostnamesLowerCase } from "./armPostResponseRule";

test('armBatchResponseRule isApplicable for batch requests with a POST method', () => {
    const rule = new ArmBatchResponseRule();

    const entry = <Entry>{
        request: {
            method: 'POST',
            url: 'https://microsoft.com'
        },
        response: {
            status: 200,
            content: {}
        }
    }

    expect(rule.isApplicable(entry)).toBeFalsy();

    for (const hostname of armHostnamesLowerCase) {
        entry.request.url = `https://${hostname}`
        expect(rule.isApplicable(entry)).toBeFalsy();
    }

    for (const hostname of armHostnamesLowerCase) {
        entry.request.url = `https://${hostname}/batch`;
        expect(rule.isApplicable(entry)).toBeTruthy();
    }
})

test('armBatchResponseRule sanitize ', () => {
    const rule = new ArmBatchResponseRule();
    const uberBatchRequest = <UberBatchRequest>{
        requests: [{
            httpMethod: 'GET',
            url: 'https://getrequest',
        },
        {
            httpMethod: 'POST',
            url: 'https://post-json-response',
            content: {}
        },
        {
            httpMethod: 'POST',
            url: 'https://post-non-json-response',
            content: {}
        },
        {
            httpMethod: 'POST',
            url: 'https://post-non-success-response',
            content: {}
        }]
    };

    const uberBatchResponse = <UberBatchResponse>{
        responses: [{
            httpStatusCode: 200,
            content: {
                stringProp: 'stringValue'
            }
        },
        {
            httpStatusCode: 200,
            content: {
                stringProp: 'stringValue',
                arrayProp: ['stringValue0'],
                numProp: 1,
                properties: {
                    childStringProp: 'childStringValue'
                }
            }
        },
        {
            httpStatusCode: 200,
            content: 'some non JSON value'
        },
        {
            httpStatusCode: 400,
            content: {
                stringProp: 'stringValue'
            }
        }]
    }

    const entry = <Entry>{
        request: {
            method: 'POST',
            url: 'https://management.azure.com/batch',
            postData: {
                mimeType: MimeType.json,
                text: JSON.stringify(uberBatchRequest)
            }

        },
        response: {
            status: 200,
            content: {
                mimeType: MimeType.json,
                text: JSON.stringify(uberBatchResponse)
            }
        }
    };

    rule.sanitize(entry);
    const sanitizedUberResponse: UberBatchResponse = JSON.parse(entry.response.content.text);

    expect(sanitizedUberResponse.responses[0].content.stringProp).toEqual('stringValue');

    expect(sanitizedUberResponse.responses[1].content.stringProp).toEqual(REDACTED);
    expect(sanitizedUberResponse.responses[1].content.arrayProp[0]).toEqual('stringValue0');
    expect(sanitizedUberResponse.responses[1].content.numProp).toEqual(1);
    expect(sanitizedUberResponse.responses[1].content.properties.childStringProp).toEqual(REDACTED);

    expect(sanitizedUberResponse.responses[2].content).toEqual(REDACTED);

    expect(sanitizedUberResponse.responses[3].content.stringProp).toEqual('stringValue');
})