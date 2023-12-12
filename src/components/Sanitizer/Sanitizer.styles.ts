import { ICheckboxStyles, IStackStyles } from "@fluentui/react";

const checkboxWidth = 300;

export const checkboxStyle: ICheckboxStyles = {
    label: {
        width: `${checkboxWidth}px`
    }
}

export const layoutStackStyle: React.CSSProperties = {
    marginTop: '300px'
}


export const containerStyle: React.CSSProperties = {
    border: '1px solid lightgray',
    padding: '50px 130px',
    borderRadius: '10px'
}

export const radioButtonStackStyle: IStackStyles = {
    root: {
        width: `${checkboxWidth * 2 + 20}px`,
        marginTop: '20px'
    },
};