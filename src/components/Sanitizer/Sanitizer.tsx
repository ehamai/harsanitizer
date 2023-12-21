import { DefaultButton, Link, PrimaryButton, Stack, Text } from "@fluentui/react"
import { getContainerStyle, layoutStackStyle } from "./Sanitizer.styles"
import { useState } from "react";
import { HarFile } from "../../sanitizer/models/harFile";
import { SanitizationCategories } from "../../sanitizer/sanitizer";
import { onFileUpload, sanitizeAndCompressFile } from "../../common/fileUpload";
import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { SanitizerRuleCheckboxes } from "./SanitizerRuleCheckboxes";

export interface SanitizerProps {
  setInspectFile: React.Dispatch<React.SetStateAction<boolean>>;
  setSanitizedFileJson: React.Dispatch<React.SetStateAction<HarFile | null>>;
}

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

  const restart = () => {
    setDownloadUrl('');
    setFileName('');
  }

  const dropHandler = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingFile(false);

    if (event.dataTransfer.items && event.dataTransfer.items.length > 0 && event.dataTransfer.items[0].kind === 'file') {
      await sanitizeAndCompressFile(
        (event.dataTransfer.items[0].getAsFile() as File),
        sanitizationCategories,
        setFileName,
        setDownloadUrl,
        setSanitizedFileJson,
        appInsights);
    }
  }

  const dragOverHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingFile(true);
  }

  const dragEndHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingFile(false);
  }

  const getDownloadOrInspectButtons = () => {
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
      <SanitizerRuleCheckboxes sanitizationCategories={sanitizationCategories} setSanitizationCategories={setSanitizationCategories} />
     <div style={{ marginTop: '50px' }}>
        {getDownloadOrInspectButtons()}
      </div>
    </div>
  </Stack>
}