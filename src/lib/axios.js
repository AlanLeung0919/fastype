import axios from 'axios';
import NProgress from 'nprogress';
import store from '../store/index.js';

const instance = axios.create({
	baseURL:
		process.env.NODE_ENV === 'production'
			? process.env.VUE_APP_BASEURL + '/api'
			: 'http://localhost:8081/api'
});

instance.interceptors.request.use(
	(config) => {
		if (!NProgress.isRendered()) NProgress.start();
		if (config.url.substring(0, 4) === 'text') return config;
		const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
		const token = googleUser.getAuthResponse().id_token;
		if (!token) store.commit('setAlert', 'please sign in first');
		else config.headers.authorization = token;
		return config;
	},
	(err) => {
		return Promise.reject(err);
	}
);

instance.interceptors.response.use(
	(res) => {
		NProgress.done();
		return res;
	},
	(err) => {
		NProgress.done();
		if (err.response && err.response.status >= 400)
			store.commit('setAlert', 'Oops! Something went wrong');
		return Promise.reject(err);
	}
);

export default instance;
