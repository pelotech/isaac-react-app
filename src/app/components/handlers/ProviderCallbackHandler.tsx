import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {Redirect, withRouter} from "react-router-dom";
import {handleProviderCallback} from "../../state/actions";
import {AppState} from "../../state/reducers";
import {AuthenticationProvider} from "../../../IsaacApiTypes";
import {LoggedInUser} from "../../../IsaacAppTypes";
import * as persistance from "../../services/localStorage"
import {KEY} from "../../services/localStorage"
import {FIRST_LOGIN_STATE, isFirstLoginInPersistance} from "../../services/firstLogin";

const stateToProps = (state: AppState) => (state && {user: state.user});
const dispatchToProps = {handleProviderCallback: handleProviderCallback};

interface ProviderCallbackHandlerProps {
    match: {params: {provider: AuthenticationProvider}};
    location: {search: string};
    user: LoggedInUser | null;
    handleProviderCallback: (provider: AuthenticationProvider, search: string) => void;
}

const ProviderCallbackHandlerComponent = (props: ProviderCallbackHandlerProps) => {
    const {match: {params: {provider}}, location: {search}, user, handleProviderCallback} = props;

    useEffect(() => {
        handleProviderCallback(provider, search);
    }, []);

    const nextPage = '/'; // TODO MT handle afterAuth in local storage
    return <React.Fragment>
        {user ?
            (user.loggedIn && isFirstLoginInPersistance() ?
                <Redirect to="/account" /> :
                <Redirect to={nextPage} />)
            :
            <div>Signing in...</div>
        }
    </React.Fragment>;
};

export const ProviderCallbackHandler =
    withRouter(connect(stateToProps, dispatchToProps)(ProviderCallbackHandlerComponent));
