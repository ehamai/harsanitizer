import { REDACTED } from "../common/constants";
import { Entry } from "../models/harFile";
import { AuthorizationRequestRule } from "./authorizationRule"

test('authorizationRequestRule isApplicable', () => {
    const rule = new AuthorizationRequestRule();
    const entry = <Entry>{};
    expect(rule.isApplicable(entry)).toBeTruthy();
})

test('authorization headers are sanitized', () => {
    const rule = new AuthorizationRequestRule();
    const safeHeaderName = 'safeHeader';
    const safeHeaderValue = 'safeValue';
    const authorizationHeader = 'Authorization';

    const entry = <Entry>{
        request: {
            headers: [{
                name: safeHeaderName,
                value: safeHeaderValue
            },
            {
                name: authorizationHeader,
                value: 'notSafeValue'
            }]
        }
    }

    rule.sanitize(entry);

    expect(entry.request.headers.length).toBe(2);
    expect(entry.request.headers[0].name).toBe(safeHeaderName);
    expect(entry.request.headers[0].value).toBe(safeHeaderValue);
    expect(entry.request.headers[1].name).toBe(authorizationHeader);
    expect(entry.request.headers[1].value).toBe(REDACTED);
})

test('bearer tokens are sanitized from request body', () => {
    const rule = new AuthorizationRequestRule();
    const fakeToken = 'Bearer 0123458.abcdef.3jd9js-dfjk349g';
    const postText = `Test ${fakeToken} token`;

    const entry = <Entry>{
        request: {
            headers: <any>[],
            postData: {
                text: postText
            }
        }
    };

    rule.sanitize(entry);
    expect(entry.request.postData?.text === postText.replace(fakeToken, REDACTED));
})
