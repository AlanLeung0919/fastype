import axios from 'axios';
import store from '../store/index.js';

const instance = axios.create({
	baseURL:
		process.env.NODE_ENV === 'development'
			? 'http://localhost:8081/api'
			: process.env.VUE_APP_BASEURL + '/api'
});

instance.interceptors.request.use(
	(config) => {
		if (config.url.substring(0, 4) === 'text') return config;
		const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
		const token = googleUser.getAuthResponse().id_token;
		if (!token) {
			store.commit('setAlert', 'Please sign in first');
		} else {
			config.headers.authorization = token;
		}
		return config;
	},
	(err) => {
		Promise.reject(err);
	}
);

instance.interceptors.response.use(
	(res) => {
		return res;
	},
	(err) => {
		if (err.response && err.response.status >= 400)
			store.commit('setAlert', 'Oops! Something went wrong');
		Promise.reject(err);
	}
);

export default instance;
