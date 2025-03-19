// src/components/IdleTimerHandler.tsx
import React, { Component, ReactNode } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface IdleTimerHandlerProps extends RouteComponentProps {
  children: ReactNode;
}

class IdleTimerHandler extends Component<IdleTimerHandlerProps> {
  private idleTimeout: NodeJS.Timeout | null = null;
  private idleDuration: number = 30 * 60 * 1000; // 30 minutes in milliseconds
// private idleDuration: number = 1 * 60 * 1000;

  componentDidMount() {
    this.startIdleTimer();
    this.addActivityListeners();
  }

  componentWillUnmount() {
    this.clearIdleTimer();
    this.removeActivityListeners();
  }

  startIdleTimer = () => {
    this.clearIdleTimer();
    this.idleTimeout = setTimeout(this.handleLogout, this.idleDuration);
  };

  clearIdleTimer = () => {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
  };

  addActivityListeners = () => {
    window.addEventListener('mousemove', this.resetIdleTimer);
    window.addEventListener('keydown', this.resetIdleTimer);
    window.addEventListener('click', this.resetIdleTimer);
    window.addEventListener('scroll', this.resetIdleTimer);
  };

  removeActivityListeners = () => {
    window.removeEventListener('mousemove', this.resetIdleTimer);
    window.removeEventListener('keydown', this.resetIdleTimer);
    window.removeEventListener('click', this.resetIdleTimer);
    window.removeEventListener('scroll', this.resetIdleTimer);
  };

  resetIdleTimer = () => {
    this.startIdleTimer();
  };

  handleLogout = () => {
    localStorage.removeItem('authToken');
    // If using abp:
    // abp.auth.clearToken();

    // Redirect to logout
    // this.props.history.push('/logout');
    // Redirect to login
    window.location.href = 'https://www.digitalsupplychain.bharatbenz.com/dicvscar/DaimDISC/#/login';
    // window.location.href = 'https://www.digitalsupplychain.bharatbenz.com/dicvscar/DaimDISC/#/login';
  };

  render() {
    return <>{this.props.children}</>;
  }
}

export default withRouter(IdleTimerHandler);