import { DetailsList, DetailsListLayoutMode, DetailsRow, IColumn, IDetailsRowProps, IDetailsRowStyles } from "@fluentui/react";
import { Entry, HarFile } from "../sanitizer/models/harFile";
import { Text } from '@fluentui/react';
import { convertBatchEntryToEntries as convertBatchRequestsToEntries } from "../common/batchConverter";
import { getTheme } from '@fluentui/react/lib/Styling';

export interface TraceInspectorProps {
    fileContent: HarFile
}

export interface InspectorEntry extends Entry {
    isBatchChildEntry: boolean;
}

const theme = getTheme();

const getTextStyle = (statusCode: number): React.CSSProperties => {
    if(statusCode >= 400){
        return {
            color: theme.palette.redDark
        }
    }

    return {};
}


export function TraceInspector(props: TraceInspectorProps) {
    const fileContent = props.fileContent;
    // const entries = [...fileContent.log.entries];

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
            return <Text style={getTextStyle(item.response.status)}>{item.request.method}</Text>
        }
    };

    const onRenderUrlCol = (item?: InspectorEntry, index?: number, column?: IColumn) => {
        if (item) {
            if(item.isBatchChildEntry){
                return <Text style={getTextStyle(item.response.status)}>&nbsp;&nbsp;&nbsp;&nbsp;- {item.request.url}</Text>
            }
            
            return <Text style={getTextStyle(item.response.status)}>{item.request.url}</Text>
        }
    };

    const onRenderStatus = (item?: InspectorEntry, index?: number, column?: IColumn) => {
        if (item) {
            return <Text style={getTextStyle(item.response.status)}>{item.response.status}</Text>
        }
    };

    const onRenderDuration = (item?: InspectorEntry, index?: number, column?: IColumn) => {
        if (item) {
            return <Text style={getTextStyle(item.response.status)}>{Math.round(item.time)}</Text>
        }
    };

    const onRenderRow = (props: IDetailsRowProps | undefined) =>{
        const customStyles: Partial<IDetailsRowStyles> = {};
    if (props) {
      if (props.itemIndex % 2 === 0) {
        customStyles.root = { backgroundColor: theme.palette.themeLighterAlt };
      }

      return <DetailsRow {...props} styles={customStyles} />;
    }
    return null;
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

    return <DetailsList
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

    // return <h1>trace inspector</h1>;
}
