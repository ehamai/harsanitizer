import { Checkbox, Link, Stack, Text } from "@fluentui/react"
import { checkboxStyle, containerStyle, layoutStackStyle, radioButtonStackStyle } from "./Sanitizer.styles"
import { FormEvent, useState } from "react";
import { HarFile } from "../../sanitizer/models/harFile";
import { SanitizationCategories } from "../../sanitizer/sanitizer";
import { onFileUpload } from "../../common/fileUpload";

export interface SanitizerProps{
    setInspectFile: React.Dispatch<React.SetStateAction<boolean>>;
    setSanitizedFileJson: React.Dispatch<React.SetStateAction<HarFile | null>>;
}

const stackTokens = {
    childrenGap: 10
  };

export const Sanitizer = (props: SanitizerProps) =>{
    const [downloadUrl, setDownloadUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const [sanitizationCategories, setSanitizationCategories] = useState<SanitizationCategories>({
      cookiesAndHeaders: true,
      authorizationTokens: true,
      armPostResponses: true,
      generalJsonResponses: true,
      generalJsonPutPostRequests: true
    });

    const {setInspectFile, setSanitizedFileJson } = props;

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
    
      let downloadButton = <></>;
      if (downloadUrl) {
        downloadButton = <div>
          Download <Link href={downloadUrl} download={fileName}> {fileName}</Link> or <Link onClick={() => { setInspectFile(true) }}>Inspect</Link>
        </div>;
      }

    return <Stack enableScopedSelectors horizontalAlign="center" verticalAlign='center' style={layoutStackStyle}>
    <Text variant='xxLarge' style={{ position: 'relative', left: '-263px', marginBottom: '10px' }}>HAR file sanitizer (preview)</Text>
    <div style={containerStyle}>
      <Text variant='mediumPlus'>Choose categories to sanitize and then upload a file</Text>
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
      <Stack horizontal style={{marginTop: '50px'}}>
          <input
            type="file"
            id="input-file"
            onChange={(event) => {
              onFileUpload(event,
                sanitizationCategories,
                setFileName,
                setDownloadUrl,
                setSanitizedFileJson)
            }}/>
          <Text>{downloadButton}</Text>
      </Stack>
    </div>
  </Stack>

}