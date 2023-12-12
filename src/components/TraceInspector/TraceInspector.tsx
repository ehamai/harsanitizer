import { DetailsList, DetailsListLayoutMode, DetailsRow, IColumn, IDetailsRowProps, IDetailsRowStyles, Link } from "@fluentui/react";
import { Entry, HarFile } from "../../sanitizer/models/harFile";
import { Text } from '@fluentui/react';
import { convertBatchEntryToEntries as convertBatchRequestsToEntries } from "../../common/batchConverter";
import { getTheme } from '@fluentui/react/lib/Styling';
import { useState } from "react";
import { RequestPanel } from "./RequestPanel";

export interface TraceInspectorProps {
    fileContent: HarFile
}

export interface InspectorEntry extends Entry {
    isBatchChildEntry: boolean;
}

const theme = getTheme();

export const getStatusCodeColor = (statusCode: number) => {
    if (statusCode >= 400 && statusCode < 500) {
        return theme.palette.orange;
    } else if(statusCode >= 500){
        return theme.palette.redDark;
    }

    return theme.palette.black;
}

const getRequestStyle = (statusCode: number): React.CSSProperties =>{
    return { color: getStatusCodeColor(statusCode) };

}

export function TraceInspector(props: TraceInspectorProps) {
    const fileContent = props.fileContent;
    const [selectedEntry, setSelectedEntry] = useState<InspectorEntry | null>(null);

    const entries: InspectorEntry[] = [];
    for (const entry of fileContent.log.entries) {
        entries.push({
            ...entry,
            isBatchChildEntry: false
        });

        convertBatchRequestsToEntries(entry, entries);
    }

    const onRenderMethodCol = (item?: InspectorEntry, index?: number, column?: IColumn) => {
        if (item) {
            return <Text style={getRequestStyle(item.response.status)}>{item.request.method}</Text>
        }
    };

    const onRenderUrlCol = (item?: InspectorEntry, index?: number, column?: IColumn) => {
        if (item) {
            if (item.isBatchChildEntry) {
                return <Link onClick={() =>{ setSelectedEntry(item)}} style={getRequestStyle(item.response.status)}>&nbsp;&nbsp;&nbsp;&nbsp;- {item.request.url}</Link>
            }

            return <Link onClick={() =>{ setSelectedEntry(item)}} style={getRequestStyle(item.response.status)}>{item.request.url}</Link>
        }
    };

    const onRenderStatus = (item?: InspectorEntry, index?: number, column?: IColumn) => {
        if (item) {
            return <Text style={getRequestStyle(item.response.status)}>{item.response.status}</Text>
        }
    };

    const onRenderDuration = (item?: InspectorEntry, index?: number, column?: IColumn) => {
        if (item) {
            return <Text style={getRequestStyle(item.response.status)}>{Math.round(item.time)}</Text>
        }
    };

    const onRenderRow = (props: IDetailsRowProps | undefined) => {
        const customStyles: Partial<IDetailsRowStyles> = {};
        if (props) {
            if (props.itemIndex % 2 === 0) {
                customStyles.root = { backgroundColor: theme.palette.themeLighterAlt };
            }

            return <DetailsRow {...props} styles={customStyles} />;
        }
        return null;
    }

    const dismissPanel = () =>{
        setSelectedEntry(null);
    }

    const columns: IColumn[] = [{
        key: 'method',
        name: 'Method',
        onRender: onRenderMethodCol,
        minWidth: 60
    },
    {
        key: 'url',
        name: 'URL',
        onRender: onRenderUrlCol,
        minWidth: 500,
        maxWidth: 700,
        isResizable: true
    },
    {
        key: 'status',
        name: 'Status',
        onRender: onRenderStatus,
        minWidth: 50,
        isResizable: false
    },
    {
        key: 'duration',
        name: 'Duration',
        onRender: onRenderDuration,
        minWidth: 70,
        isResizable: false
    }];

    return <>
        <DetailsList
            items={entries}
            columns={columns}
            setKey="set"
            compact={true}
            layoutMode={DetailsListLayoutMode.fixedColumns}
            onRenderRow={onRenderRow}
            // selection={this._selection}
            // selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="select row"
        // onItemInvoked={this._onItemInvoked}
        />
        <RequestPanel entry={selectedEntry} dismissPanel={dismissPanel}></RequestPanel>
    </>

    // return <h1>trace inspector</h1>;
}
