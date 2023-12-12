export interface UberBatchRequest {
    requests: BatchRequest[],
    headers?: BatchHeaders;
}

export interface UberBatchResponse {
    responses: BatchResponse[];
}

export interface BatchHeaders {
    [id: string]: string[];
}

export interface BatchRequest {
    httpMethod: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE' | 'OPTION',
    url: string;
    content: ArmObj;
    requestHeaderDetails: { [id: string]: string };
}

export interface BatchResponse {
    httpStatusCode: number;
    headers: { [id: string]: string };
    content: any;
    contentLength: number;
}

export interface ArmObj {
    id: string;
    name: string;
    type: string;
    location: string;
    properties: object;
}