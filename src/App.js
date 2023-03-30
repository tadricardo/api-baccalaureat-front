import React, { Component,lazy } from 'react';
import { HashRouter , Route, Switch } from 'react-router-dom';
import './scss/style.scss';
import ProtectedRoute from "./router/ProtectedRoute";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from "@fortawesome/free-regular-svg-icons";

library.add(fab, fas, far)
const loading = (
  <>
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
  </>
)

// Containers
const TheLayout = lazy(() => import('./containers/TheLayout'));

// Pages
const Login = lazy(() => import('./views/pages/login/Login'));
const Page404 = lazy(() => import('./views/pages/page404/Page404'));
const Page500 = lazy(() => import('./views/pages/page500/Page500'));
const ForgotPassword = lazy(() => import('./views/pages/forgotPassword/ForgotPassword'))
const UpdatePassword = lazy(() => import('./views/pages/forgotPassword/UpdatePassword'))
const Wiki = lazy(() => import('./views/pages/wiki/Wiki'));
class App extends Component {

  render() {
    return (
      <HashRouter>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/doc" name="Documentation" render={props => <Wiki {...props}/>} />
              <Route exact path="/forgotPassword" name="Forgotten Password" render={props => <ForgotPassword {...props}/>} />
              <Route exact path="/updatePassword" name="Change password" render={props => <UpdatePassword {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <ProtectedRoute path="/" name="Home" render={props => <TheLayout {...props}/>} redirectTo="/login" /> 
            </Switch>
          </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
