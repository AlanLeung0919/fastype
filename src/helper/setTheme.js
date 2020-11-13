import store from '../store/index.js';
import themeList from '@/assets/theme.json';

export default () => {
	let theme = localStorage.getItem('theme');
	let themeObj = themeList.filter((e) => e.name === theme);
	const customTest = ['bgColor', 'mainColor', 'subColor'];
	const defaultCustom = {
		name: 'custom',
		bgColor: '#111111',
		mainColor: '#dddddd',
		subColor: '#444444'
	};
	if (theme === 'custom') {
		let custom;
		try {
			custom = JSON.parse(localStorage.getItem('custom'));
		} catch (err) {
			custom = defaultCustom;
			localStorage.setItem('custom', JSON.stringify(custom));
		}
		if (
			!custom ||
			custom.name !== 'custom' ||
			!customValid(custom, customTest)
		) {
			custom = defaultCustom;
			localStorage.setItem('custom', JSON.stringify(custom));
		}
		store.commit('setTheme', custom);
	} else {
		if (!theme || themeObj.length !== 1) {
			theme = 'dark';
			localStorage.setItem('theme', theme);
			themeObj = themeList.filter((e) => e.name === theme);
		}
		store.commit('setTheme', themeObj[0]);
	}
};

function customValid(obj, props) {
	for (let i = 0; i < props.length; i++) {
		if (!obj.hasOwnProperty(props[i])) return false;
	}
	return true;
}
