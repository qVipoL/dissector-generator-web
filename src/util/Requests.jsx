const Requests = {
    async requestConversion(data) {
        const response = await fetch('http://localhost/dissector-generator-api/api/routes/dissectors/convert.php', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });

        return await response.json();
    },

    async requestCreate(action, data) {
        const actionUrl = `http://localhost/dissector-generator-api/api/routes/dissectors/${action}`;
        const response = await fetch(actionUrl, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });

        return await response.json();
    },

    async requestDelete(id) {
        const response = await fetch(`http://localhost/dissector-generator-api/api/routes/dissectors/delete.php?id=${id}`, {
            method: 'DELETE',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        });

        return await response.json();
    },

    async logoutRequest() {
        const response = await fetch('http://localhost/dissector-generator-api/api/routes/auth/logout.php', {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        });

        return await response.json();
    },

    async loginRequest(data) {
        const response = await fetch('http://localhost/dissector-generator-api/api/routes/auth/login.php', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });

        return await response.json();
    },

    async registerRequest(data) {
        const response = await fetch('http://localhost/dissector-generator-api/api/routes/auth/register.php', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });

        return await response.json();
    }
};

export default Requests;