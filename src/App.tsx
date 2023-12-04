import { FormEvent, useEffect, useState } from 'react';
import { SanitizationCategories,  } from './sanitizer/sanitizer';
import { Link, Checkbox, Stack, Text } from '@fluentui/react';
import { onFileUpload } from './common/fileUpload';
import { checkboxStyle, containerStyle, fileUploadStyle, layoutStackStyle, logIssueLinkeStyle, radioButtonStackStyle } from './App.styles';
import { TraceInspector } from './components/TraceInspector';
import { HarFile } from './sanitizer/models/harFile';

const stackTokens = {
  childrenGap: 10
};

const title = 'HAR file sanitizer (preview)';

function App() {
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [inspectFile, setInspectFile] = useState(false);
  const [sanitizedFileJson, setSanitizedFileJson] = useState<HarFile | null>(null);
  const [sanitizationCategories, setSanitizationCategories] = useState<SanitizationCategories>({
    cookiesAndHeaders: true,
    authorizationTokens: true,
    armPostResponses: true,
    generalJsonResponses: true,
    generalJsonPutPostRequests: true
  });

  useEffect(() => {
    document.title = title;
  }, [])

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
    downloadButton = <div style={{ marginTop: '10px' }}>
      Download <Link href={downloadUrl} download={fileName}> {fileName}</Link> or <Link onClick={() => {setInspectFile(true)}}>Inspect</Link>
    </div>;
  }

  return (
    inspectFile ? (
      <TraceInspector fileContent={sanitizedFileJson as HarFile}></TraceInspector>
    ) : (
    <div>
      <Stack horizontalAlign="end" horizontal>
        <Link href='https://github.com/ehamai/harsanitizer/issues' target='_blank' style={logIssueLinkeStyle}>Log issues</Link>
      </Stack>
      <Stack enableScopedSelectors horizontalAlign="center" verticalAlign='center' style={layoutStackStyle}>
        <Text variant='xxLarge' style={{ position: 'relative', left: '-263px', marginBottom: '10px' }}>{title}</Text>
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
          <div>
            <Text>
              <input type="file" id="input-file" onChange={(event) =>{ onFileUpload(event, sanitizationCategories, setFileName, setDownloadUrl, setSanitizedFileJson) }} style={fileUploadStyle} />
              {downloadButton}
            </Text>
          </div>
        </div>
      </Stack>
    </div>)
  );
}

export default App;
