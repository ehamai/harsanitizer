import { REDACTED, dangerousKeywords } from "../common/constants";
import { Entry } from "../models/harFile";
import { CookiesAndHeadersRule } from "./cookiesAndHeadersRule"

test('CookiesAndHeadersRule cleans headers with dangerous keywords', () =>{
    const rule = new CookiesAndHeadersRule();
    const safeHeader = 'safeHeader';
    const safeValue = 'safeValue';

    const entry = <Entry>{
        request: {
            method: 'POST',
            url: 'https://management.azure.com',
            headers: [{
                name: safeHeader,
                value: safeValue
            }]
        },
        response: {
            headers: [{
                name: safeHeader,
                value: safeValue
            }]
        }
    }

    const keywords = [...dangerousKeywords, 'cookie', 'set-cookie', 'ocp-apim-header-authorization'];

    for(const keyword of keywords){
        entry.request.headers.push({ name: keyword, value: 'dangerous value'});
        entry.response.headers.push({ name: keyword, value: 'dangerous value'});
    }

    rule.sanitize(entry);
    expect(entry.request.headers[0].name).toEqual(safeHeader);
    expect(entry.request.headers[0].value).toEqual(safeValue);
    expect(entry.response.headers[0].name).toEqual(safeHeader);
    expect(entry.response.headers[0].value).toEqual(safeValue);

    for(let i = 1; i < entry.request.headers.length; i++){
        expect(entry.request.headers[i].name).toEqual(keywords[i-1]);
        expect(entry.request.headers[i].value).toEqual(REDACTED);
        expect(entry.response.headers[i].name).toEqual(keywords[i-1]);
        expect(entry.response.headers[i].value).toEqual(REDACTED);
    }
})

test('CookiesAndHeadersRule cleans all cookies', () =>{
    const rule = new CookiesAndHeadersRule();
    const someCookie = 'someCookie';
    const someCookieValue = 'someCookieValue';

    const entry = <Entry>{
        request: {
            method: 'POST',
            url: 'https://management.azure.com',
            cookies: [{
                name: someCookie,
                value: someCookieValue
            }]
        },
        response: {
            cookies: [{
                name: someCookie,
                value: someCookieValue
            }]
        }
    };

    rule.sanitize(entry);
    expect(entry.request.cookies[0].name).toEqual(someCookie);
    expect(entry.request.cookies[0].value).toEqual(REDACTED);
    expect(entry.response.cookies[0].name).toEqual(someCookie);
    expect(entry.response.cookies[0].value).toEqual(REDACTED);
})