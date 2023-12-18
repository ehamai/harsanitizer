import { Checkbox, DefaultButton, Link, PrimaryButton, Stack, Text } from "@fluentui/react"
import { checkboxStyle, getContainerStyle, layoutStackStyle, radioButtonStackStyle } from "./Sanitizer.styles"
import { FormEvent, useState } from "react";
import { HarFile } from "../../sanitizer/models/harFile";
import { SanitizationCategories } from "../../sanitizer/sanitizer";
import { onFileUpload, sanitizeAndCompressFile } from "../../common/fileUpload";
import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js";

export interface SanitizerProps {
  setInspectFile: React.Dispatch<React.SetStateAction<boolean>>;
  setSanitizedFileJson: React.Dispatch<React.SetStateAction<HarFile | null>>;
}

const stackTokens = {
  childrenGap: 10
};

export const Sanitizer = (props: SanitizerProps) => {
  const { setInspectFile, setSanitizedFileJson } = props;

  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [sanitizationCategories, setSanitizationCategories] = useState<SanitizationCategories>({
    cookiesAndHeaders: true,
    authorizationTokens: true,
    armPostResponses: true,
    generalJsonResponses: true,
    generalJsonPutPostRequests: true
  });

  const appInsights = useAppInsightsContext();

  const onChecked = (event: FormEvent<HTMLInputElement | HTMLElement> | undefined, checked?: boolean | undefined) => {
    if (event) {
      const newRulesToRun = { ...sanitizationCategories };
      if (newRulesToRun[event.currentTarget.id] === undefined) {
        throw Error(`Could not find property: "${event.currentTarget.id}"`);
      }

      newRulesToRun[event.currentTarget.id] = (event.currentTarget as any).checked;
      setSanitizationCategories(newRulesToRun);
    }
  }

  const restart = () => {
    setDownloadUrl('');
    setFileName('');
  }

  const dropHandler = async (event: React.DragEvent<HTMLDivElement>) =>{
    event.preventDefault();
    setIsDraggingFile(false);

    if(event.dataTransfer.items && event.dataTransfer.items.length > 0 && event.dataTransfer.items[0].kind === 'file'){
      await sanitizeAndCompressFile(
        (event.dataTransfer.items[0].getAsFile() as File),
        sanitizationCategories,
        setFileName,
        setDownloadUrl,
        setSanitizedFileJson,
        appInsights);
    }
  }

  const dragOverHandler = (event: React.DragEvent<HTMLDivElement>) =>{
    event.preventDefault();
    setIsDraggingFile(true);
  }

  const dragEndHandler = (event: React.DragEvent<HTMLDivElement>) =>{
    event.preventDefault();
    setIsDraggingFile(false);
  }

  const getButtons = () => {
    if (!downloadUrl) {
      return <input
        type="file"
        id="input-file"
        onChange={(event) => {
          onFileUpload(event,
            sanitizationCategories,
            setFileName,
            setDownloadUrl,
            setSanitizedFileJson,
            appInsights);
        }} />
    } else {
      return <Stack>
        <Text>Successfully sanitized and stored in '{fileName}' (<Link onClick={restart}>Restart</Link>)</Text>
        <div style={{ marginTop: '15px' }}>
          <PrimaryButton href={downloadUrl} download={fileName}>Download</PrimaryButton>
          <DefaultButton style={{ marginLeft: '10px' }} onClick={() => { setInspectFile(true) }}>Inspect</DefaultButton>
        </div>
      </Stack>
    }
  }

  return <Stack enableScopedSelectors horizontalAlign="center" verticalAlign='center' style={layoutStackStyle}>
      <Text variant='xxLarge' style={{ position: 'relative', left: '-263px', marginBottom: '10px' }}>HAR file sanitizer (preview)</Text>
      <div style={getContainerStyle(isDraggingFile)} onDrop={dropHandler} onDragOver={dragOverHandler} onDragLeave={dragEndHandler}>
        <Text variant='mediumPlus'>Choose categories to sanitize.  Then select or drag and drop a HAR file to upload.</Text>
        <Stack tokens={stackTokens} styles={radioButtonStackStyle} horizontal wrap>
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
        <div style={{ marginTop: '50px' }}>
          {getButtons()}
        </div>
      </div>
    </Stack>
}