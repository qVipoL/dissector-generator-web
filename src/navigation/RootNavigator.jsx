import React, { useState, useEffect } from 'react';
import Auth from '../util/Auth';
import HomeNavigator from './HomeNavigator';
import AuthNavigator from './AuthNavigator';

export default function RootNavigator() {
    const [isAuth, changeAuth] = useState(false);

    useEffect(() => {
        Auth.setAuth(changeAuth);
    }, [isAuth])

    return (
        Auth.isAuthenticated() ? <HomeNavigator /> : <AuthNavigator />
    );
};