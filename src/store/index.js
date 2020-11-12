import Vue from 'vue';
import Vuex from 'vuex';
import axios from '@/lib/axios';
import setTheme from '@/helper/setTheme';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user: {
			email: '',
			username: '',
			imageUrl: ''
		},
		theme: {
			name: '',
			bgColor: '',
			mainColor: '',
			subColor: ''
		},
		alert: '',
		authState: false
	},
	mutations: {
		setAlert(state, alert) {
			state.alert = alert;
		},
		setTheme(state, theme) {
			state.theme = theme;
		},
		setAuthState(state, val) {
			state.authState = val;
		},
		setUser(state, user) {
			state.authState = user.authState;
			state.user.email = user.email;
			state.user.username = user.username;
			state.user.imageUrl = user.imageUrl;
		},
		signOut(state) {
			state.authState = false;
			state.user.email = '';
			state.user.username = '';
			state.user.imageUrl = '';
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
					console.log(res);
					commit('setUser', {
						email: res.data.email,
						username: res.data.name,
						imageUrl: profile.getImageUrl(),
						authState: googleAuth.isSignedIn.get()
					});
					localStorage.setItem('theme', res.data.config.theme);
					localStorage.setItem(
						'custom',
						JSON.stringify(res.data.config.custom)
					);
					setTheme();
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
});
