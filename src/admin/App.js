import React, { Component, Suspense } from 'react';
import { HashRouter as Router, Switch } from 'react-router-dom';
import PermissionRoute from './routes/PermissionRoute';
import Loading from './components/basic/Loading';
import ErrorBoundary from './components/basic/ErrorBoundary';
import Routes from './routes';
import './styles/normalize.scss';
import './styles/common.scss';
import Config from '@root/config';

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<Loading />}>
            <Switch>
              <PermissionRoute
                config={{
                  ...Routes
                }}
                globalConfig={Config}
              />
            </Switch>
          </Suspense>
        </Router>
      </ErrorBoundary>
    );
  }
}

export default App;
