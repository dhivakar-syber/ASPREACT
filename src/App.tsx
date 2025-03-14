import './App.css';

import * as React from 'react';

import Router from './components/Router';
import SessionStore from './stores/sessionStore';
import SignalRAspNetCoreHelper from './lib/signalRAspNetCoreHelper';
import Stores from './stores/storeIdentifier';
import { inject } from 'mobx-react';
import AuthenticationStore from './stores/authenticationStore';

export interface IAppProps {
  sessionStore?: SessionStore;
  authenticationStore?: AuthenticationStore;
}

@inject(Stores.SessionStore, Stores.AuthenticationStore)
class App extends React.Component<IAppProps> {
  private tokenCheckInterval: any;

  async componentDidMount() {
    await this.props.sessionStore!.getCurrentLoginInformations();

    if (!!this.props.sessionStore!.currentLogin.user && this.props.sessionStore!.currentLogin.application.features['SignalR']) {
      if (this.props.sessionStore!.currentLogin.application.features['SignalR.AspNetCore']) {
        SignalRAspNetCoreHelper.initSignalR();
      }
    }

    // Call the function initially
    this.props.authenticationStore?.initializeRefresh();

    // Start a background process to repeatedly call it every 5 minutes
    this.tokenCheckInterval = setInterval(() => {
      this.props.authenticationStore?.initializeRefresh();
    }, 3000); // 300000 ms = 5 minutes
  }

  componentWillUnmount() {
    // Clear interval when component unmounts to prevent memory leaks
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  }

  public render() {
    return <Router />;
  }
}

export default App;
