import React, { FormEvent, useState } from 'react';
import { SanitizationCategories, sanitize } from './sanitizer/sanitizer';
import { HarFile } from './sanitizer/models/harFile';
import { Link, Checkbox, Stack, ICheckboxStyles, IStackStyles, Text } from '@fluentui/react';

const checkboxWidth = 300;

const checkboxStyle: ICheckboxStyles = {
  label: {
    width: `${checkboxWidth}px`
  }
}

const layoutStackStyle: React.CSSProperties = {
  marginTop: '300px'
}

const containerStyle: React.CSSProperties = {
  border: '1px solid lightgray',
  padding: '50px 130px',
  borderRadius: '10px'
}

const radioButtonStackStyle: IStackStyles = {
  root: {
    width: `${checkboxWidth * 2 + 20}px`,
    marginTop: '20px'
  },
};

const fileUploadStyle: React.CSSProperties = {
  marginTop: '50px',
  display: 'inline-block'
}

const stackTokens = {
  childrenGap: 10
};

function App() {
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [sanitizationCategories, setSanitizationCategories] = useState<SanitizationCategories>({
    cookiesAndHeaders: true,
    authorizationTokens: true,
    armPostResponses: true,
    generalJsonResponses: true,
    generalJsonPutPostRequests: true
  });

  const readFileContent = (file: File) => {
    const reader = new FileReader()
    return new Promise<string>((resolve, reject) => {
      reader.onload = event => {
        let content = event.target && event.target.result as string;
        if (!content) {
          content = '{}';
        }
        resolve(content);
      }
      reader.onerror = error => reject(error)
      reader.readAsText(file)
    })
  }

  const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    if (input.files && input.files.length > 0) {
      setFileName(input.files[0].name);
      readFileContent(input.files[0]).then(content => {
        try {
          const parsedContent = JSON.parse(content) as HarFile;
          sanitize(parsedContent, sanitizationCategories);

          console.log(parsedContent);
          const blob = new Blob([JSON.stringify(parsedContent)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          console.log(url);
          setDownloadUrl(url);
        } catch (e) {
          console.log('Failed to parse file');
        }
      }).catch(error => console.log(error))
    }
  }

  const getOutputFileName = (inputFileName: string) => {
    const parts = inputFileName.split('.har');
    if (parts.length === 2) {
      return `${parts[0]}.sanitized.har`;
    }

    return 'sanitized.har';
  }

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
    const outputFileName = getOutputFileName(fileName);
    downloadButton = <div style={{ marginTop: '10px' }}>
        Download <Link href={downloadUrl} download={outputFileName}> {outputFileName}</Link>
    </div>;
  }


  return (
    <div>
      <Stack enableScopedSelectors horizontalAlign="center" verticalAlign='center' style={layoutStackStyle}>
        <Text variant='xxLarge' style={{ position: 'relative', left: '-345px', marginBottom: '10px' }}>HAR Sanitizer</Text>
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
              <input type="file" id="input-file" onChange={onFileUpload} style={fileUploadStyle} />
              {downloadButton}
            </Text>
          </div>
        </div>
      </Stack>
    </div>
  );
}

export default App;
