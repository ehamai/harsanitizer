export interface UberBatchRequest {
    requests: BatchRequest[],
    headers?: BatchHeader;
}

export interface BatchHeader {
    [id: string]: string[];
}

export interface BatchRequest {
    httpMethod: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE' | 'OPTION',
    url: string;
    content: BatchRequestContent,
    requestHeaderDetails: { [id: string]: string };
}

export interface BatchRequestContent {
    id: string;
    name: string;
    type: string;
    location: string;
    properties: object;
}