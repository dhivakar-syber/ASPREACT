import * as React from 'react';

import { BrowserRouter,Route, Switch } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import utils from '../../utils/utils';
import tokenAuthService from '../../services/tokenAuth/tokenAuthService';
import AppConsts from '../../lib/appconst';

declare var abp: any;

const Router = () => {


  const handleThirdPartyLogin = async(props:any) => {
    const token = new URLSearchParams(props.location.search).get("token");

    if (token) {

      console.log('ThirdParty_Token',token)
      // Store the token in localStorage
      localStorage.setItem("authToken", token);


      try {
        console.log('Third-party login initiated');



        const result = await tokenAuthService.authenticate({
          userNameOrEmailAddress: 'admin', // Replace with dynamic user info
          password: '123qwsde',              // Replace with dynamic password
          rememberClient: false,
        });

        const tokenExpireDate = new Date(new Date().getTime() + 1000 * result.expireInSeconds);
        abp.auth.setToken(result.accessToken, tokenExpireDate);
        abp.utils.setCookieValue(
          AppConsts.authorization.encrptedAuthTokenName,
          result.encryptedAccessToken,
          tokenExpireDate,
          abp.appPath
        );

       window.location.href='/';
       return null
      } catch (error) {
        console.error('Authentication failed:', error);
      //return <Redirect to="/login" />;// Redirect to login if authentication fails
      window.location.href='/login';

      return null
      }


      // Optionally, validate the token with the backend here
      // axios.post("/api/ValidateToken", { token }).then(...);

      // Redirect to the home page
      //return <Redirect to="/" />;
    }

    // If no token is provided, redirect to the login page
    //return <Redirect to="/login" />;

    return null
  };

  


  const UserLayout = utils.getRoute('/user').component;
  const AppLayout = utils.getRoute('/').component;

  return (
    <BrowserRouter basename="ToolCapPro/">
      <Switch>
        <Route path="/user" render={(props: any) => <UserLayout {...props} />} />
        <Route
          path="/fetchdata"
          render={handleThirdPartyLogin}
        />
        <ProtectedRoute path="/" render={(props: any) => <AppLayout {...props} exact />} />
      </Switch>
    </BrowserRouter>
    
  );
};

export default Router;
