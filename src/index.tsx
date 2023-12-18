import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { AppInsightsContext, AppInsightsErrorBoundary, ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from "history";
import './index.css';

initializeIcons(/* optional base url */);

const browserHistory = createBrowserHistory({ basename: '' } as any);
const reactPlugin = new ReactPlugin();
const connectionString = (window as any).sanitizer?.appInsights?.connectionString;

if(connectionString){
  let appInsights = new ApplicationInsights({
    config: {
      connectionString,
      extensions: [reactPlugin],
      extensionConfig: {
        [reactPlugin.identifier]: { history: browserHistory }
      }
    }
  });
  appInsights.loadAppInsights();  
}

ReactDOM.render(
  <React.StrictMode>
    <AppInsightsErrorBoundary onError={() => <h1>Something went wrong</h1>} appInsights={reactPlugin}>
      <AppInsightsContext.Provider value={reactPlugin}>
        <App />
      </AppInsightsContext.Provider>
    </AppInsightsErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
