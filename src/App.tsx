import { useEffect, useState } from 'react';
import { Link, Stack } from '@fluentui/react';
import { TraceInspector } from './components/TraceInspector/TraceInspector';
import { HarFile } from './sanitizer/models/harFile';
import { Sanitizer } from './components/Sanitizer/Sanitizer';

const title = 'HAR file sanitizer (preview)';

const logIssueLinkeStyle: React.CSSProperties = {
  margin: '30px'
}

function App() {
  const [inspectFile, setInspectFile] = useState(false);
  const [sanitizedFileJson, setSanitizedFileJson] = useState<HarFile | null>(null);

  useEffect(() => {
    document.title = title;
  }, [])

  return (
    inspectFile ? (
      <TraceInspector fileContent={sanitizedFileJson as HarFile}></TraceInspector>
    ) : (
      <div>
        <Stack horizontalAlign="end" horizontal>
          <Link href='https://github.com/ehamai/harsanitizer/issues' target='_blank' style={logIssueLinkeStyle}>Log issues</Link>
        </Stack>
        <Sanitizer setInspectFile={setInspectFile} setSanitizedFileJson={setSanitizedFileJson}></Sanitizer>
      </div>)
  );
}

export default App;
