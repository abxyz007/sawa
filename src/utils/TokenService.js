import axios from "axios";

const TOKEN_KEY = 'Authorization';
const REFRESH_TOKEN_KEY = 'Refresh';
const EXPIRE_TIME = 'expire_id';

const TokenService = {
	getToken() {
		return localStorage.getItem(TOKEN_KEY);
	},
	saveToken(token) {
		localStorage.setItem(TOKEN_KEY, token);
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
	},
	removeToken() {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.clear();
	},
	removeRefreshToken() {
		localStorage.removeItem(REFRESH_TOKEN_KEY);
	},
	setRoles(roles) {
		localStorage.setItem('roles', roles);
	},
	getRoles() {
		return localStorage.getItem('roles');
	},
	setPermissions(permissions) {
		localStorage.setItem('permissions', JSON.stringify(permissions));
	},
	setUserName(userName) {
		localStorage.setItem('userName', JSON.stringify(userName));
	},
	removeUserName() {
		localStorage.removeItem('userName');
	},
	getUserName() {
		return localStorage.getItem('userName');
	},
	getLogin() {
		return localStorage.getItem('login');
	},
	removePermissions() {
		localStorage.removeItem('permissions');
	},
	getExpireTime() {
		return localStorage.getItem(EXPIRE_TIME);
	},
	setExpireTime(time) {
		let expTime = Date.now() + ((time - 300) * 1000);
		localStorage.setItem(EXPIRE_TIME, expTime);
	},
	checkExpire() {
		let expire = localStorage.getItem(EXPIRE_TIME);
		if (expire && new Date(expire).getTime() < new Date().getTime()) {
			this.removeToken()
		}

	},

};

export default TokenService;
