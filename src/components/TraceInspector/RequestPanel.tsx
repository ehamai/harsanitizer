import { Label, Panel, PanelType, Pivot, PivotItem } from "@fluentui/react";
import { InspectorEntry } from "./TraceInspector";
import { HeadersTab } from "./HeadersTab";
import { getTabContainerStyle } from "./RequestPanel.styles";
import { ParametersTab } from "./ParametersTab";

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
        <Pivot>
            <PivotItem headerText="Request Headers">
                <div style={getTabContainerStyle()}>
                    <HeadersTab entry={entry} isResponseHeaders={false}></HeadersTab>
                </div>
            </PivotItem>
            <PivotItem headerText="Query Parameters">
                <div style={getTabContainerStyle()}>
                    <ParametersTab url={entry.request.url}></ParametersTab>
                </div>
            </PivotItem>
            <PivotItem headerText="Body">
                <div style={getTabContainerStyle()}>
                    <Label>Pivot #3</Label>
                </div>
            </PivotItem>
        </Pivot>
        <Pivot>
            <PivotItem headerText="Response Headers">
                <div style={getTabContainerStyle()}>
                    <HeadersTab entry={entry} isResponseHeaders={true}></HeadersTab>
                </div>
            </PivotItem>
            <PivotItem headerText="Body">
                <div style={getTabContainerStyle()}>
                    <Label>Pivot #3</Label>
                </div>
            </PivotItem>
        </Pivot>
    </Panel>

}