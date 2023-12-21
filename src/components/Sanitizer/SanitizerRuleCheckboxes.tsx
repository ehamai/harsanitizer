import { Checkbox, Dialog, DialogFooter, DialogType, PrimaryButton, Stack } from "@fluentui/react"
import { checkboxStyle, radioButtonStackStyle } from "./Sanitizer.styles"
import { SanitizationCategories } from "../../sanitizer/sanitizer"
import { FormEvent, useState } from "react"
import React from "react"

export interface SanitizerRuleCheckboxesProps {
    sanitizationCategories: SanitizationCategories,
    setSanitizationCategories: React.Dispatch<React.SetStateAction<SanitizationCategories>>
}

const dialogContentProps = {
    type: DialogType.normal,
    title: 'Be careful when disabling sanitization rules',
    subText: `Disabling a rule means that the resulting HAR file may still contain sensitive information. If you proceed, make sure you manually inspect and scrub secrets from the file. If secrets are required for an investigation, make sure the HAR file is only shared through secure channels and is password-protected.`,
};

let warningWasShown = false;

export const SanitizerRuleCheckboxes = (props: SanitizerRuleCheckboxesProps) => {
    const { sanitizationCategories, setSanitizationCategories } = props;
    const [hideDialog, setHideDialog] = useState(true);

    const modalProps = {
        isBlocking: true,
    }

    const updateSanitizationRules = (ruleId: string, isChecked: boolean) => {
        const newRulesToRun = { ...sanitizationCategories };
        if (newRulesToRun[ruleId] === undefined) {
            throw Error(`Could not find property: "${ruleId}"`);
        }

        newRulesToRun[ruleId] = isChecked;
        setSanitizationCategories(newRulesToRun);
    }

    const showWarningDialog = () => {
        setHideDialog(false);
    }

    const onChecked = async (event: FormEvent<HTMLInputElement | HTMLElement> | undefined, checked?: boolean | undefined) => {
        if (event) {
            const { id, checked } = (event.currentTarget as any);

            if (!checked && !warningWasShown) {
                showWarningDialog();
                warningWasShown = true;
            }
            
            updateSanitizationRules(id, checked);
        }
    }

    const onWarningDialogClosed = () => {
        setHideDialog(true);
    }

    return <>
        <Dialog
            hidden={hideDialog}
            onDismiss={showWarningDialog}
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}>
            <DialogFooter>
                <PrimaryButton text="Ok" onClick={ onWarningDialogClosed } />
            </DialogFooter>
        </Dialog>
        <Stack tokens={{ childrenGap: 10 }} styles={radioButtonStackStyle} horizontal wrap>
            <Checkbox
                label="Cookies and headers"
                checked={sanitizationCategories.cookiesAndHeaders}
                id={'cookiesAndHeaders'}
                onChange={onChecked}
                styles={checkboxStyle} />

            <Checkbox
                label="Authorization Tokens"
                checked={sanitizationCategories.authorizationTokens}
                id={'authorizationTokens'}
                onChange={onChecked}
                styles={checkboxStyle} />

            <Checkbox
                label="JSON PUT and POST Requests"
                checked={sanitizationCategories.generalJsonPutPostRequests}
                id={'generalJsonPutPostRequests'}
                onChange={onChecked}
                styles={checkboxStyle} />

            <Checkbox
                label="ARM Post Responses"
                checked={sanitizationCategories.armPostResponses}
                id={'armPostResponses'}
                onChange={onChecked}
                styles={checkboxStyle} />

            <Checkbox
                label="JSON responses"
                checked={sanitizationCategories.generalJsonResponses}
                id={'generalJsonResponses'}
                onChange={onChecked}
                styles={checkboxStyle} />
        </Stack>
    </>
}