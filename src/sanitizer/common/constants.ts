export class MimeType{
    public static readonly json = 'application/json';
    public static readonly xml = 'application/xml';
}

export const dangerousKeywords: string[] = [
    'secret',
    'password',
    'pwd',
    'token',
    'connectionstring',
    'key',
    'credential',
    'cookie'
];

export const REDACTED = '___REDACTED___';