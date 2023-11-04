import React, { useState } from 'react';
import { sanitize } from './sanitizer/sanitizer';
import { HarFile } from './sanitizer/models/harFile';

function App() {
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileName, setFileName] = useState('');

  const readFileContent = (file: File) => {
    const reader = new FileReader()
    return new Promise<string>((resolve, reject) => {
      reader.onload = event => {
        let content = event.target && event.target.result as string;
        if(!content){
          content = '{}';
        }
        resolve(content);
      }
      reader.onerror = error => reject(error)
      reader.readAsText(file)
    })
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    if (input.files && input.files.length > 0) {
      setFileName(input.files[0].name);
      readFileContent(input.files[0]).then(content => {
        try{
          const parsedContent = JSON.parse(content) as HarFile;
          sanitize(parsedContent);
  
          console.log(parsedContent);
          const blob = new Blob([JSON.stringify(parsedContent)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          console.log(url);
          setDownloadUrl(url);
        }catch(e){
          console.log('Failed to parse file');
        }
      }).catch(error => console.log(error))
    }
  }

  const getOutputFileName = (inputFileName: string) =>{
    const parts = inputFileName.split('.har');
    if(parts.length === 2){
      return `${parts[0]}.sanitized.har`;
    }

    return 'sanitized.har';
  }

  let downloadButton = <div><a href={downloadUrl} download={getOutputFileName(fileName)}>Download</a></div>; 
  if(!downloadUrl){
    downloadButton = <span></span>;
  }

  return (
    <div>
      <label htmlFor="input-file">Specify a file:</label><br />
      <input type="file" id="input-file" onChange={onChange} />
      {downloadButton}
    </div>
  );
}

export default App;
