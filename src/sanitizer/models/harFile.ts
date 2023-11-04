export interface HarFile{
    log: {
        entries: Entry[];
    }
}

export interface Entry{
    request: Request;
    response: Response;
}

export interface Request{
    method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE' | 'OPTION',
    url: string;
    headers: NameValueKeyPair[];
    queryString: NameValueKeyPair[];
    cookies: any[];  // etodo:
    postData?: Content;
}

export interface Response{
    status: number;
    statusText: string;
    headers: NameValueKeyPair[];
    cookies: any[];
    content: Content;
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
