import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DissectorHome from '../pages/Dissector/DissectorHome.jsx';

export default function AuthNavigator() {
    return (
        <>
            <Routes>
                <Route path={'/dissector-generator-web'} element={<DissectorHome />} />
                <Route path={'/dissector-generator-web/view'} element={<DissectorHome />} />
                <Route path={'/dissector-generator-web/create'} element={<DissectorHome />} />
                <Route path={'/dissector-generator-web/update'} element={<DissectorHome />} />
                <Route path={'*'} element={<Navigate to="/dissector-generator-web" />} />
            </Routes>
        </>
    )
};