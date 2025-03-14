import { action, observable, decorate } from "mobx";
import AppConsts from "./../lib/appconst";
import LoginModel from "../models/Login/loginModel";
import tokenAuthService from "../services/tokenAuth/tokenAuthService";

declare var abp: any;

class AuthenticationStore {
  loginModel = new LoginModel();
  tokenRefreshInterval: any;
  idleTimeout: any = null;
  userIsActive = false;

  get isAuthenticated(): boolean {
    return !!abp.session.userId;
  }

  async login(model: LoginModel) {
    let result = await tokenAuthService.authenticate({
      userNameOrEmailAddress: model.userNameOrEmailAddress,
      password: model.password,
      rememberClient: model.rememberMe,
    });
  
    const tokenExpireDate = new Date().getTime() + result.expireInSeconds * 1000;
  
    // Ensure previous token refresh is cleared
    this.clearTokenRefreshSchedule();
  
    abp.auth.setToken(result.accessToken, new Date(tokenExpireDate));
    abp.utils.setCookieValue(
      AppConsts.authorization.encrptedAuthTokenName,
      result.encryptedAccessToken,
      new Date(tokenExpireDate),
      abp.appPath
    );
  
    localStorage.setItem("tokenExpireAt", tokenExpireDate.toString());
  
    this.scheduleTokenRefresh(result.expireInSeconds);
    this.setupIdleTimeout();
  
    console.log("User logged in successfully!");
  }
  

  initializeRefresh() {
    const storedExpireAt = localStorage.getItem("tokenExpireAt");
    const currentToken = abp.auth.getToken();
    const encryptedToken = abp.utils.getCookieValue(AppConsts.authorization.encrptedAuthTokenName);

    if (storedExpireAt) {
      const expireAt = parseInt(storedExpireAt);
      const currentTime = new Date().getTime();
      let remainingTime = expireAt - currentTime;

      if (remainingTime > 0 && remainingTime <= 300000) {
        if (this.userIsActive) {
          const extendedExpireAt = currentTime + 1800000;

          abp.auth.setToken(currentToken, new Date(extendedExpireAt));
          abp.utils.setCookieValue(
            AppConsts.authorization.encrptedAuthTokenName,
            encryptedToken,
            new Date(extendedExpireAt),
            abp.appPath
          );

          localStorage.setItem("tokenExpireAt", extendedExpireAt.toString());

          remainingTime = extendedExpireAt - new Date().getTime();
          console.log(`Refreshing token in ${remainingTime / 1000} seconds`);
        }
      } else if (remainingTime <= 0) {
        console.log("Token expired. Logging out user...");
        this.logout();
        window.location.href = "/logout";
      }
    }
  }

  scheduleTokenRefresh(expirySeconds: number) {
    console.log(`Scheduling token refresh every ${expirySeconds - 60} seconds`);

    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
    }

    this.tokenRefreshInterval = setInterval(() => {
      console.log("Executing scheduled token refresh...");
      this.initializeRefresh();
    }, Math.max((expirySeconds - 60) * 1000, 5000));
  }

  clearTokenRefreshSchedule() {
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
      this.tokenRefreshInterval = null;
    }
  }

  logout() {
    console.log("Logging out user...");
  
    // Remove authentication-related tokens only
    localStorage.removeItem("tokenExpireAt");
    localStorage.removeItem("enc_auth_token"); // If used
    localStorage.removeItem("Abp.AuthToken");
    
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");

    sessionStorage.removeItem("enc_auth_token");
    sessionStorage.removeItem("Abp.AuthToken");
  
    abp.auth.clearToken();
    abp.utils.deleteCookie(AppConsts.authorization.encrptedAuthTokenName);
  
    this.clearTokenRefreshSchedule();
    this.userIsActive = false;
  
    // Redirect to login page after logout
    window.location.href = "/login";
  }
  

  setupIdleTimeout() {
    const resetIdleTimer = () => {
      this.userIsActive = true;
      clearTimeout(this.idleTimeout);
      this.idleTimeout = setTimeout(() => {
        this.userIsActive = false;
      }, 300000);
    };

    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    window.addEventListener("click", resetIdleTimer);

    resetIdleTimer();
  }
}

// Use `decorate` to make MobX work in older versions
decorate(AuthenticationStore, {
  loginModel: observable,
  userIsActive: observable,
  login: action,
  initializeRefresh: action,
  scheduleTokenRefresh: action,
  clearTokenRefreshSchedule: action,
  logout: action,
  setupIdleTimeout: action,
});

export default AuthenticationStore;
