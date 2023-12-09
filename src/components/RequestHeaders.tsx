import {
    DetailsList,
    ITextFieldStyleProps,
    ITextFieldStyles,
    Label,
    Stack,
    StackItem,
    TextField,
    getTheme,
    Text,
    IColumn,
    SelectionMode
} from "@fluentui/react";
import { InspectorEntry, getStatusCodeColor } from "./TraceInspector";
import { NameValueKeyPair } from "../sanitizer/models/harFile";

export interface HeaderTabProps {
    entry: InspectorEntry,
    isResponseHeaders: boolean;
}

const theme = getTheme();

function getStyles(props: ITextFieldStyleProps): Partial<ITextFieldStyles> {
    // const { required } = props;
    return {
        fieldGroup: [
            {
                // width: 300
                height: '20px',
                marginTop: '5px',
                // minWidth: '400px',
                // maxWidth: '600px'
            },
            // required && {
            //     borderTopColor: props.theme.semanticColors.errorText,
            // },
        ]
    };
}

const tabContainerStyle: React.CSSProperties = {
    padding: '10px 0px',
    display: 'flex',
    flexFlow: 'column',
    height: 'calc(50vh - 75px)'
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

const headerContainerStyle: React.CSSProperties = {
    marginTop: '10px',
    marginLeft: '10px',
    flex: '1 1 auto',
    overflowY: 'auto'
}

const addressContainerStyle: React.CSSProperties = {
    flex: '0 1 auto'
}

export const RequestHeaders = (props: HeaderTabProps) => {
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
        : <div style={addressContainerStyle}>
            <Stack horizontal tokens={{ childrenGap: '10px' }} >
                <StackItem grow={1}><Label style={{ marginLeft: '10px' }}>{request.method}</Label></StackItem>
                <StackItem grow={100}><TextField defaultValue={request.url} readOnly styles={getStyles}></TextField></StackItem>
                <StackItem grow={1}><Label style={getStatusCodeStyle(response.status)}>{response.status}</Label></StackItem>
            </Stack>
        </div>

    const getHeaderComponents = (headers: NameValueKeyPair[]) => {
        const headerComponents = [];
        for (let i = 0; i < headers.length; i++) {
            const headerComponent = <Stack horizontal key={i} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <Text style={{ width: '125px' }}>{headers[i].name}</Text>
                <Text>{headers[i].value}</Text>
            </Stack>

            headerComponents.push(headerComponent);
        }

        return headerComponents;
    }

    // flex: 1 1 auto;
    return <div style={tabContainerStyle}>
        {addressComponent}
        <div style={headerContainerStyle}>
            {getHeaderComponents(headers)}
        </div>
    </div>
}
