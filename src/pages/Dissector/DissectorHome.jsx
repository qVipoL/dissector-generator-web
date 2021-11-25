import React from 'react';
import NavBar from '../../components/NavBar';
import DissectorList from '../../components/DissectorList';

export default function DissectorHome() {
    return (
        <>
            <NavBar />
            {/* TODO: render component on a specific path */}
            <DissectorList />
        </>
    );
}