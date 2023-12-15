import { ICheckboxStyles, IStackStyles } from "@fluentui/react";

const checkboxWidth = 300;

export const checkboxStyle: ICheckboxStyles = {
    label: {
        width: `${checkboxWidth}px`
    }
}

export const layoutStackStyle: React.CSSProperties = {
    marginTop: '150px'
}

export const getContainerStyle = (isDraggingFile: boolean): React.CSSProperties => {
    let border = '1px solid lightgray';
    if(isDraggingFile){
        border = '5px dashed lightblue';
    }
    
    return {
        border,
        padding: '50px 130px 25px 130px',
        borderRadius: '10px'
    }
}

export const radioButtonStackStyle: IStackStyles = {
    root: {
        width: `${checkboxWidth * 2 + 20}px`,
        marginTop: '20px'
    },
};