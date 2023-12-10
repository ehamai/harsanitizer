import { InspectorEntry } from "../components/TraceInspector/TraceInspector";
import { UberBatchRequest, UberBatchResponse } from "../sanitizer/models/batchRequest";
import { Entry, NameValueKeyPair } from "../sanitizer/models/harFile";
import { isBatchRequest } from "../sanitizer/requestRules/armBatchResponseRule";

const convertBatchHeadersToHeaders = (batchHeaders: { [id: string]: string }) => {
    const headers: NameValueKeyPair[] = [];
    for (const key of Object.keys(batchHeaders)) {
        headers.push({
            name: key,
            value: batchHeaders[key]
        });
    }

    return headers;
}

export const convertBatchEntryToEntries = (entry: Entry, entries: InspectorEntry[]) => {
    if (isBatchRequest(entry.request) && entry.request.postData) {
        const uberBatchRequest: UberBatchRequest = JSON.parse(entry.request?.postData.text);
        const uberBatchResponse: UberBatchResponse = JSON.parse(entry.response.content.text);

        for (let i = 0; i < uberBatchRequest.requests.length; i++) {
            const batchRequest = uberBatchRequest.requests[i];
            const batchResponse = uberBatchResponse.responses[i];
            let url = batchRequest.url;
            if(url.startsWith('http')){
                const parsedUrl = new URL(url);
                url = url.split(parsedUrl.origin)[1];   // keep path + query string
            }

            const newEntry: InspectorEntry = {
                request: {
                    method: batchRequest.httpMethod,
                    url: url,
                    headers: convertBatchHeadersToHeaders(batchRequest.requestHeaderDetails),
                    queryString: [],
                    cookies: [],
                    postData: {
                        mimeType: 'application/json',
                        text: JSON.stringify(batchRequest.content)
                    }
                },
                response: {
                    status: batchResponse.httpStatusCode,
                    statusText: '',
                    headers: convertBatchHeadersToHeaders(batchResponse.headers),
                    cookies: [],
                    content: {
                        mimeType: 'application/json',
                        text: JSON.stringify(batchResponse.content)
                    },
                    _transferSize: batchResponse.contentLength
                },
                time: 0,
                isBatchChildEntry: true
            }

            entries.push(newEntry);
        }
    }
}