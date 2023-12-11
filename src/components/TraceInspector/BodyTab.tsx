import { ITextFieldStyles, TextField } from "@fluentui/react";
import { InspectorEntry } from "./TraceInspector"
import { getTabContainerItemStretchVertical } from "./RequestPanel.styles";
import { useEffect, useRef, useState } from "react";

export interface BodyTabProps{
    entry: InspectorEntry;
    isResponseBody: boolean;
}

function getTextboxStyles(height: number): Partial<ITextFieldStyles> {
    return {
      field: {
        whiteSpace: 'nowrap',
        height: `${height - 2}px`
      },
    };
  }

export const BodyTab = (props: BodyTabProps) =>{
    const {entry, isResponseBody} = props;

    const [height, setHeight] = useState(0)
    const ref = useRef(null)

    const onResize = () =>{
        setHeight((ref?.current as any)?.clientHeight ?? 0);
    }

    useEffect(() =>{
        setHeight((ref.current as any)?.clientHeight ?? 0);
        window.addEventListener("resize", onResize);
    }, [])

    let content: string = '';
    if(!isResponseBody){
        if(entry.request.postData){
            try{
                content = entry.request.postData?.text ?? '';
                content = JSON.stringify(JSON.parse(content), null, '  ');
            } catch(e){}
        }
    } else if(entry.response.content.text){
        try{
            content = entry.response.content.text;
            content = JSON.stringify(JSON.parse(content), null, '  ')
        } catch(e){}
    }

    return <div style={getTabContainerItemStretchVertical()} ref={ref}>

        {/* Purposely leaving out the readonly property because it messes up the formatting for some reason */}
        <TextField multiline value={content} styles={getTextboxStyles(height)} resizable={false}/>
    </div>

}