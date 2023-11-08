import exp from "constants";
import { MimeType, REDACTED } from "../common/constants";
import { Entry } from "../models/harFile"
import { ArmPostResponseRule, armHostnamesLowerCase } from "./armPostResponseRule";

test('armPostResponseRule is not applicable for non-POST requests', () =>{
    const methods = ['GET', 'PUT', 'PATCH', 'DELETE', 'OPTION'];
    const rule = new ArmPostResponseRule();

    for(const method of methods){
        const entry = <Entry>{
            request: {
                method
            }
        }
    
        expect(rule.isApplicable(entry)).toBeFalsy();
    }
})

test('armPostResponseRule is applicable for ARM requests only', () =>{
    const rule = new ArmPostResponseRule();
    const entry = <Entry>{
        request: {
            method: 'POST',
            url: 'https://microsoft.com'
        },
        response: {
            status: 200
        }
    }

    expect(rule.isApplicable(entry)).toBeFalsy();

    for(const hostname of armHostnamesLowerCase){
        entry.request.url = `https://${hostname}`;
        expect(rule.isApplicable(entry)).toBeTruthy();
    }

    entry.response.status = 400;
    expect(rule.isApplicable(entry)).toBeFalsy();
})

test('armPostResponseRule is not applicable for some ARM paths', () =>{
    const rule = new ArmPostResponseRule();
    const entry = <Entry>{
        request: {
            method: 'POST',
            url: 'https://management.azure.com/batch'
        },
        response: {
            status: 200
        }
    }

    expect(rule.isApplicable(entry)).toBeFalsy();

    entry.request.url = 'https://management.azure.com/providers/microsoft.resourcegraph/resources';
    expect(rule.isApplicable(entry)).toBeFalsy();
})

test('armPostResponseRule redacts entire non-json response', () =>{
    const rule = new ArmPostResponseRule();
    const entry = <Entry>{
        request: {
            method: 'POST',
            url: 'https://management.azure.com'
        },
        response: {
            status: 200,
            content: {
                mimeType: MimeType.xml,
                text: 'Some XML response'
            }
        }
    }

    rule.sanitize(entry);
    expect(entry.response.content.text).toEqual(REDACTED);
})

test('armPostResponseRule redacts all properties of json response', () =>{
    const rule = new ArmPostResponseRule();
    const responseData = {
        textProp: 'text',
        arrayProp: ['text0'],
        numProp: 1,
        objProp: {
            childTextProp: 'text'
        }
    }

    const entry = <Entry>{
        request: {
            method: 'POST',
            url: 'https://management.azure.com'
        },
        response: {
            status: 200,
            content: {
                mimeType: MimeType.json,
                text: JSON.stringify(responseData)
            }
        }
    }

    rule.sanitize(entry);
    const sanitizedResponseData = JSON.parse(entry.response.content.text);
    expect(sanitizedResponseData.textProp).toEqual(REDACTED);
    expect(sanitizedResponseData.arrayProp[0]).toEqual('text0');
    expect(sanitizedResponseData.numProp).toEqual(1);
    expect(sanitizedResponseData.objProp.childTextProp).toEqual(REDACTED);
})