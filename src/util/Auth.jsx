import Requests from '../util/Requests';

const { loginRequest } = Requests;

class Auth {
    constructor() {
        let res = localStorage.getItem('cookie');

        this.cookie = !res ? null : JSON.parse(res);

        this.authenticated = !res ? false : true;
    }

    async setAuth(changeAuth) {
        const res = await loginRequest({});
        this.changeAuth = changeAuth;

        if (res?.message === 'Invalid email or password')
            this.logout();

        this.changeAuth(this.authenticated);
    }

    login(data) {
        this.authenticated = true;
        this.cookie = data;
        this.changeAuth(true);

        localStorage.setItem('cookie', JSON.stringify(this.cookie));
    }

    logout() {
        this.authenticated = false;
        this.cookie = null;
        this.changeAuth(false);

        localStorage.removeItem('cookie');
    }

    isAuthenticated() {
        return this.authenticated;
    }

    getData() {
        return this.cookie;
    }
}

export default new Auth();