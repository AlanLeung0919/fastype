import Vue from 'vue';
import Vuex from 'vuex';
import axios from '@/lib/axios.js';
import setTheme from '@/helper/setTheme.js';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		alert: '',
		email: '',
		username: '',
		imageUrl: '',
		theme: {},
		authState: false
	},
	mutations: {
		setAlert(state, alert) {
			state.alert = alert;
		},
		setInfo(state, info) {
			state.authState = info.authState;
			state.email = info.email;
			state.username = info.username;
			state.imageUrl = info.imageUrl;
		},
		setTheme(state, theme) {
			state.theme = theme;
		},
		signOut(state) {
			state.email = '';
			state.username = '';
			state.imageUrl = '';
			state.authState = false;
		},
		setAuthState(state, val) {
			state.authState = val;
		}
	},
	actions: {
		checkAuth({ commit }) {
			const googleAuth = gapi.auth2.getAuthInstance();
			const googleUser = googleAuth.currentUser.get();
			const profile = googleUser.getBasicProfile();
			if (!profile) return;
			axios
				.post('signin')
				.then((res) => {
					if (res.status != 200) return;
					commit('setInfo', {
						authState: googleAuth.isSignedIn.get(),
						email: profile.getEmail(),
						username: profile.getName(),
						imageUrl: profile.getImageUrl()
					});
					axios
						.get('theme')
						.then((res) => {
							localStorage.setItem('theme', res.data.theme);
							localStorage.setItem('custom', JSON.stringify(res.data.custom));
							setTheme();
						})
						.catch((err) => {
							console.log(err);
						});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
});
