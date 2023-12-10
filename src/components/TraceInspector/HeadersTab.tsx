import {
    ITextFieldStyleProps,
    ITextFieldStyles,
    Label,
    Stack,
    StackItem,
    TextField,
    getTheme
} from "@fluentui/react";
import { InspectorEntry, getStatusCodeColor } from "./TraceInspector";
import { getTabContainerItem, getTabContainerItemStretchVertical } from "./RequestPanel.styles";
import { NameValueList } from "../NameValueList";

export interface HeaderTabProps {
    entry: InspectorEntry,
    isResponseHeaders: boolean;
}

const theme = getTheme();

function urlTextboxStyles(props: ITextFieldStyleProps): Partial<ITextFieldStyles> {
    return {
        fieldGroup: [
            {
                height: '20px',
                marginTop: '5px',

            }
        ]
    };
}

const getStatusCodeStyle = (statusCode: number) => {
    let color = getStatusCodeColor(statusCode);
    if (statusCode < 400) {
        color = theme.palette.green;
    }

    return {
        color
    }
}

export const HeadersTab = (props: HeaderTabProps) => {
    const { isResponseHeaders } = props;
    const { request, response } = props.entry;

    // const headers = request.headers;
    const headers = [];
    for (let i = 0; i < 100; i++) {
        headers.push({
            name: `name ${i}`,
            value: `value ${i}`
        })
    }

    const addressComponent = isResponseHeaders
        ? <></>
        : <div style={getTabContainerItem()}>
            <Stack horizontal tokens={{ childrenGap: '10px' }} >
                <StackItem grow={1}><Label style={{ marginLeft: '10px' }}>{request.method}</Label></StackItem>
                <StackItem grow={100}><TextField defaultValue={request.url} readOnly styles={urlTextboxStyles}></TextField></StackItem>
                <StackItem grow={1}><Label style={getStatusCodeStyle(response.status)}>{response.status}</Label></StackItem>
            </Stack>
        </div>

    return <>
        {addressComponent}
        <div style={getTabContainerItemStretchVertical()}>
            <NameValueList nameValuePairs={headers}></NameValueList>
        </div>
    </>
}
