export interface HarFile{
    log: {
        entries: Entry[];
    }
}

export interface Entry{
    request: Request;
    response: Response;
    time: number;
}

export interface Request{
    method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE' | 'OPTION',
    url: string;
    headers: NameValueKeyPair[];
    queryString: NameValueKeyPair[];
    cookies: any[];
    postData?: Content;
}

export interface Response{
    status: number;
    statusText: string;
    headers: NameValueKeyPair[];
    cookies: any[];
    content: Content;
    _transferSize: number;
}

export interface Cookie{
    name: string;
    value: string;
}

export interface NameValueKeyPair{
    name: string;
    value: string;
}

export interface Content{
    size?: number;
    mimeType: string;
    text: string;
}

export interface Cookie{
    name: string;
    value: string;
    path: string;
    domain: string;
    expires: Date;
    httpOnly: boolean;
    secure: boolean;
    sameSite?: string;
}