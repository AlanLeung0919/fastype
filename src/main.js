import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from './lib/axios';
import '@/assets/nprogress.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
	faKeyboard,
	faUser,
	faCog,
	faCrown,
	faFlagCheckered,
	faSignInAlt,
	faSignOutAlt,
	faArrowUp,
	faRedoAlt,
	faNetworkWired,
	faKey,
	faDoorClosed,
	faInfoCircle,
	faSearch,
	faCircleNotch,
	faDoorOpen
} from '@fortawesome/free-solid-svg-icons';
import VueTippy, { TippyComponent } from 'vue-tippy';

library.add(
	faKeyboard,
	faUser,
	faCog,
	faCrown,
	faFlagCheckered,
	faSignInAlt,
	faSignOutAlt,
	faArrowUp,
	faRedoAlt,
	faNetworkWired,
	faKey,
	faDoorClosed,
	faInfoCircle,
	faSearch,
	faCircleNotch,
	faDoorOpen
);

Vue.use(VueTippy);

Vue.component('tippy', TippyComponent);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.prototype.$http = axios;

new Vue({
	router,
	store,
	render: function (h) {
		return h(App);
	}
}).$mount('#app');
