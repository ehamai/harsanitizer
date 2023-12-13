import { NameValueKeyPair } from "../../sanitizer/models/harFile";
import { NameValueList } from "../NameValueList";
import { getTabContainerItemStretchVertical } from "./RequestPanel.styles";

export interface ParametersTabProps{
    url: string;
}

export const ParametersTab = (props: ParametersTabProps) =>{
    let {url} = props;
    const parameters: NameValueKeyPair[] = [];

    const parsedUrl = new URL(url);
    parsedUrl.searchParams.forEach((value, name) =>{
        parameters.push({
            name,
            value
        });
    });

    return <div style={getTabContainerItemStretchVertical()}>
        <NameValueList nameValuePairs={parameters}></NameValueList>
    </div>
}