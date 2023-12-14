import { IDetailsListStyles, ITextFieldStyleProps, ITextFieldStyles, getTheme, mergeStyleSets } from "@fluentui/react";

export const gridStyles: Partial<IDetailsListStyles> = {
    root: {
        overflowX: 'scroll',
        selectors: {
            '& [role=grid]': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                height: 'calc(100vh - 50px)',
            },
        },
    },
    headerWrapper: {
        flex: '0 0 auto',
        width: '100%'
    },
    contentWrapper: {
        flex: '1 1 auto',
        overflow: 'hidden',
        width: '100%'
    },
};

export const selectionZoneClassNames = mergeStyleSets({
    header: {
        margin: 0,
    },
    row: {
        flex: '0 0 auto',
    },
    focusZone: {
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
    },
    selectionZone: {
        height: '100%',
        overflow: 'hidden',
    },
});

export const focusZoneProps = {
    className: selectionZoneClassNames.focusZone,
    'data-is-scrollable': 'true',
} as React.HTMLAttributes<HTMLElement>;


const theme = getTheme();

export const getSearchBoxStyles = (props: ITextFieldStyleProps): Partial<ITextFieldStyles> => {
    return {
        fieldGroup: [
            {
                width: '400px',
                height: '25px',
                marginTop: '10px',
                marginLeft: '10px'
            }
        ],
    }
}

export const getStatusCodeColor = (statusCode: number) => {
    if (statusCode >= 400 && statusCode < 500) {
        return theme.palette.orange;
    } else if (statusCode >= 500) {
        return theme.palette.redDark;
    }

    return theme.palette.black;
}

export const getRequestStyle = (statusCode: number): React.CSSProperties => {
    return { color: getStatusCodeColor(statusCode) };

}