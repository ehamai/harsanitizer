import { cleanProperties } from "./cleanProperties";
import { REDACTED } from "./constants";

const obj: any = {
    stringProp: 'stringValue',
    numProp: 1,
    arrayProp: [
        'stringValue1',
        {
            secret: 'secretValue'
        }
    ],
    objProp: {
        childStringProp: 'stringValue',
        childNumProp: 1,
        childArrayProp: ['stringValue1'],
        passwordProp: 'passwordValue'
    },
    keyProp: 'keyValue'
};

test('cleans all dangerous properties', () =>{
    const testObj = JSON.parse(JSON.stringify(obj));
    cleanProperties(testObj, 'cleanProperties.test');

    expect(testObj.stringProp).toEqual('stringValue');
    expect(testObj.numProp).toEqual(1);
    expect(testObj.arrayProp[0]).toEqual('stringValue1');
    expect(testObj.arrayProp[1].secret).toEqual(REDACTED);
    expect(testObj.objProp.childStringProp).toEqual('stringValue');
    expect(testObj.objProp.childNumProp).toEqual(1);
    expect(testObj.objProp.childArrayProp[0]).toEqual('stringValue1');
    expect(testObj.objProp.passwordProp).toEqual(REDACTED);
    expect(testObj.keyProp).toEqual(REDACTED);
})