import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DissectorHome from '../pages/Dissector/DissectorHome';
import DissectorCreate from '../pages/Dissector/DissectorCreate';
import DissectorUpdate from '../pages/Dissector/DissectorUpdate';
import NavBar from '../components/NavBar';

export default function AuthNavigator() {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path={'/dissector-generator-web'} element={<DissectorHome />} />
                <Route path={'/dissector-generator-web/create'} element={<DissectorCreate />} />
                <Route path={'/dissector-generator-web/update/:id'} element={<DissectorUpdate />} />
                <Route path={'*'} element={<Navigate to="/dissector-generator-web" />} />
            </Routes>
        </>
    )
};