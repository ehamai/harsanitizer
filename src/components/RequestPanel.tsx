import { Label, Panel, PanelType, Pivot, PivotItem } from "@fluentui/react";
import { InspectorEntry } from "./TraceInspector";
import { RequestHeaders } from "./RequestHeaders";

export interface RequestPanelProps {
    entry: InspectorEntry | null;
    dismissPanel: () => void;
}

export const RequestPanel = (props: RequestPanelProps) => {
    const { entry, dismissPanel } = props;

    if (!entry) {
        return <></>;
    }

    let url = entry.request.url;
    if (url.startsWith('https://')) {
        const parsedUrl = new URL(entry.request.url);
        url = parsedUrl.pathname;
    } else {
        url = url.split('?')[0];
    }


    return <Panel
        isOpen={!!entry}
        onDismiss={dismissPanel}
        type={PanelType.custom}
        customWidth={'60%'}
        isBlocking={false}
        closeButtonAriaLabel="Close"
    >
        {/* <div style={{ height: 'calc(50vh - 50px)' }}> */}
        <Pivot>
            <PivotItem headerText="Request Headers">
                <RequestHeaders entry={entry} isResponseHeaders={false}></RequestHeaders>
            </PivotItem>
            <PivotItem headerText="Parameters">
                <Label>Pivot #2</Label>
            </PivotItem>
            <PivotItem headerText="Body">
                <Label>Pivot #3</Label>
            </PivotItem>
        </Pivot>
        <Pivot>
            <PivotItem headerText="Response Headers">
                <RequestHeaders entry={entry} isResponseHeaders={true}></RequestHeaders>
            </PivotItem>
            <PivotItem headerText="Parameters">
                <Label>Pivot #2</Label>
            </PivotItem>
            <PivotItem headerText="Body">
                <Label>Pivot #3</Label>
            </PivotItem>
        </Pivot>
    </Panel>

}