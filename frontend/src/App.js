//router
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//temi
import "./Themes/theme.dark.less";
import "./Themes/theme.light.less";

//components
import AccountScreen from "./components/Screen/AccountScreen";
import CatalogScreen from "./components/Screen/CatalogScreen";
import ForgotPasswordScreen from "./components/Screen/ForgotPasswordScreen";
import HomeScreen from "./components/Screen/HomeScreen";
import LoginScreen from "./components/Screen/LoginScreen";
import NotFoundScreen from "./components/Screen/NotFoundScreen";
import ProductScreen from "./components/Screen/ProductScreen";
import RegisterScreen from "./components/Screen/RegisterScreen";
import ResetPasswordScreen from "./components/Screen/ResetPasswordScreen";
import SettingsScreen from "./components/Screen/SettingsScreen";
import Navbar from "./components/Navbar";
import NavbarSpace from "./components/NavbarSpace";

function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <NavbarSpace />
                <Switch>
                    <Route exact path="/" component={HomeScreen} />

                    <Route exact path="/register" component={RegisterScreen} />
                    <Route exact path="/login" component={LoginScreen} />
                    <Route
                        exact
                        path="/forgotPassword"
                        component={ForgotPasswordScreen}
                    />
                    <Route
                        exact
                        path="/resetPassword/:token"
                        component={ResetPasswordScreen}
                    />

                    <Route exact path="/settings" component={SettingsScreen} />
                    <Route exact path="/account" component={AccountScreen} />

                    <Route exact path="/catalog" component={CatalogScreen} />
                    <Route
                        exact
                        path="/product/:model"
                        component={ProductScreen}
                    />

                    <Route component={NotFoundScreen} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
