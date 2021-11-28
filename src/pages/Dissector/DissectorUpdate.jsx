import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Auth from '../../util/Auth';
import DissectorForm from '../../components/DissectorForm';

export default function DissectorCreate() {
    const { id } = useParams();
    const [values, setValues] = useState({
        data: null,
        reRender: false
    });

    const navigate = useNavigate();

    useEffect(
        () => {
            async function getDissector() {
                const response = await fetch(`http://localhost/dissector-generator-api/api/routes/dissectors/getById.php?id=${id}`, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    redirect: 'follow',
                    referrerPolicy: 'no-referrer'
                });

                const res = await response.json();

                if (!res.success) {
                    Auth.logout();
                    navigate('/dissector-generator-web/login');
                    return;
                }

                let fields = JSON.parse(res.dissector.fields);
                fields.id = res.dissector.id;

                setValues({ data: fields });
            }

            getDissector();
        },
        [values.reRender, navigate, id]
    );

    return (
        <>
            {values.data !== null && (
                <DissectorForm formType="update" data={values.data} />
            )}
        </>
    );
}