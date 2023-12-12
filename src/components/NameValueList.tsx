import { Stack, Text } from "@fluentui/react";
import { NameValueKeyPair } from "../sanitizer/models/harFile";

export interface NameValueListProps{
    nameValuePairs: NameValueKeyPair[];
}

const getNameValueContainerStyle = (): React.CSSProperties =>{
    return { 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap' 
    };
}

const lineHeight = '25px'
const getNameStyle =(): React.CSSProperties =>{
    return { 
        minWidth: '150px',
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap', 
        lineHeight: lineHeight, 
        marginRight: '5px' 
    }
}

const getValueStyle = (): React.CSSProperties =>{
    return { lineHeight: lineHeight };
}

export const NameValueList = (props: NameValueListProps) => {
    const { nameValuePairs} = props;
    
    const componentList = [];
    for (let i = 0; i < nameValuePairs.length; i++) {
        const nameValueComponent = <Stack horizontal key={i} style={getNameValueContainerStyle()}>
            <Text style={getNameStyle()}>{nameValuePairs[i].name}</Text>
            <Text style={getValueStyle()}>{nameValuePairs[i].value}</Text>
        </Stack>

        componentList.push(nameValueComponent);
    }

    return <>{componentList}</>;
}