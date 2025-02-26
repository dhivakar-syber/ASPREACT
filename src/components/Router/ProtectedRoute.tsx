import * as React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isGranted } from '../../lib/abpUtility';

declare var abp: any;

const ProtectedRoute = ({ path, component: Component, permission, render, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (!abp.session.userId) {
          window.location.href = 'https://www.digitalsupplychain.bharatbenz.com/dicvscar/DaimDISC/#/login';
          return null; // Prevents further rendering after redirection
        }
        // if (!abp.session.userId)
        //   return (
        //     <Redirect
        //       to={{
        //         pathname: '/user/login',
        //         state: { from: props.location },
        //       }}
        //     />
        //   );

        if (permission && !isGranted(permission)) {
          return (
            <Redirect
              to={{
                pathname: '/exception?type=401',
                state: { from: props.location },
              }}
            />
          );
        }

        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default ProtectedRoute;
