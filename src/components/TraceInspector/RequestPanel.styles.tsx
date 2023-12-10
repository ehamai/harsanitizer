// Use this to create a container within a tab which consumes half of the
// vertical space of the window.  This is used so that you can vertically
// stack a request tab over a response tab.
export const getTabContainerStyle = (): React.CSSProperties => {
    return {
        padding: '10px 0px',
        display: 'flex',
        flexFlow: 'column',
        height: 'calc(50vh - 75px)'
    }
}

// Use this to create a container within the tab which only needs to encompass
// the space of its contents
export const getTabContainerItem = (): React.CSSProperties => {
    return {
        flex: '0 1 auto'
    }
}

// Use this to create a container within the tab which needs to stretch vertically 
// to fill the remaining space of the tab
export const getTabContainerItemStretchVertical = (): React.CSSProperties => {
    return {
        marginTop: '10px',
        marginLeft: '10px',
        flex: '1 1 auto',
        overflowY: 'auto'
    }
}