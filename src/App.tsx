import { useEffect, useState } from 'react';
import { Link } from '@fluentui/react';
import { TraceInspector } from './components/TraceInspector/TraceInspector';
import { HarFile } from './sanitizer/models/harFile';
import { Sanitizer } from './components/Sanitizer/Sanitizer';

const title = 'HAR file sanitizer (preview)';

const topCornerStyle = (): React.CSSProperties => {
  return {
    position: 'absolute',
    right: '30px',
    top: '12px',
    zIndex: 100
  }
}

function App() {
  const [inspectFile, setInspectFile] = useState(false);
  const [sanitizedFileJson, setSanitizedFileJson] = useState<HarFile | null>(null);

  useEffect(() => {
    document.title = title;
  }, [])

  const getLogIssuesLink = () => {
    return <div style={topCornerStyle()}>
      <Link href='https://github.com/ehamai/harsanitizer/issues' target='_blank'>Log issues</Link>
    </div>
  }

  return (
    inspectFile ? (
      <>
        {getLogIssuesLink()}
        <TraceInspector fileContent={sanitizedFileJson as HarFile}></TraceInspector>
      </>
    ) : (
      <div>
        {getLogIssuesLink()}
        <Sanitizer setInspectFile={setInspectFile} setSanitizedFileJson={setSanitizedFileJson}></Sanitizer>
      </div>)
  );
}

export default App;
