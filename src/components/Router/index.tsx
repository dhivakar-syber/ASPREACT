import * as React from 'react';

import { BrowserRouter,Route, Switch, useHistory } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import utils from '../../utils/utils';
import tokenAuthService from '../../services/tokenAuth/tokenAuthService';
import AppConsts from '../../lib/appconst';
import Loading from '../Loading';

declare var abp: any;

const Router = () => {

  const ThirdPartyLogin = (props: any) => {
    const history = useHistory();

    React.useEffect(() => {
      const handleLogin = async () => {
        const token = new URLSearchParams(props.location.search).get('token');

        if (token) {
          console.log('discauthToken',token);
          localStorage.setItem('authToken', token);

          try {

            let dresult = await tokenAuthService.externalAuthenticate(token);

            if (dresult)
            {
              if (dresult.status === 'success'){
                let result = await tokenAuthService.sessionAndRedirect({
                  shortId: dresult.shortid,
                  rememberClient: true,
                  email:'',
                  returnUrl: props.location.search,
                });
                if (result){
                  if (result.accessToken){
                    const tokenExpireDate = new Date(
                      new Date().getTime() + 1000 * result.expireInSeconds
                    );
                    abp.auth.setToken(result.accessToken, tokenExpireDate);
                    abp.utils.setCookieValue(
                      AppConsts.authorization.encrptedAuthTokenName,
                      result.encryptedAccessToken,
                      tokenExpireDate,
                      abp.appPath
                    );
        
                    // Debugging
                    console.log("Token Set:", abp.auth.getToken());
                    console.log("Cookie Set:", abp.utils.getCookieValue(AppConsts.authorization.encrptedAuthTokenName));
        
                  }
                }
                
              }
            }
            else{
              console.log('External Authentication Result:', 'No Result');
            }

            // Redirect to the appropriate page after successful login
            window.location.href = '/PayRetro';
          } catch (error) {
            console.error('Authentication failed:', error);
            history.push('/login');
          }
        } else {
          // No token provided, redirect to login
          history.push('/login');
        }
      };

      handleLogin();
    }, [props.location, history]);

    // Display a placeholder while processing
    return <Loading />;
  };

  
  const UserLayout = utils.getRoute('/user').component;
  const AppLayout = utils.getRoute('/').component;

  return (
    <BrowserRouter basename="/PayRetro">
      <Switch>
        <Route path="/discauth" render={(props: any) => <ThirdPartyLogin {...props} />} />
        <Route path="/user" render={(props: any) => <UserLayout {...props} />} />
        <ProtectedRoute path="/" render={(props: any) => <AppLayout {...props} exact />} />
      </Switch>
    </BrowserRouter>
    
  );
};

export default Router;
