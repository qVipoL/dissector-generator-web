import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Auth/Login.jsx';
import Register from '../pages/Auth/Register.jsx';

export default function AuthNavigator() {
    return (
        <>
            <Routes>
                <Route path={'/dissector-generator-web/login'} element={<Login />} />
                <Route path={'/dissector-generator-web/register'} element={<Register />} />
                <Route path={'*'} element={<Navigate to="/dissector-generator-web/login" />} />
            </Routes>
        </>
    )
};