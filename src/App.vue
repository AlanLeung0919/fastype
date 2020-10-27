<template>
	<div id="app">
		<Nav />
		<Alert />
		<transition name="fade" mode="out-in">
			<router-view />
		</transition>
		<Foot />
	</div>
</template>

<script>
import Nav from '@/components/TheNav.vue';
import Foot from '@/components/TheFoot.vue';
import Alert from '@/components/TheAlert.vue';
import setTheme from '@/helper/setTheme.js';

export default {
	components: {
		Nav,
		Foot,
		Alert
	},
	mounted() {
		this.$store.watch(
			() => this.$store.state.theme,
			(theme) => {
				const style = document.body.style;
				style.setProperty('--bg-color', theme.bgColor);
				style.setProperty('--main-color', theme.mainColor);
				style.setProperty('--sub-color', theme.subColor);
			}
		);
		setTheme();
	}
};
</script>

<style>
html,
body {
	margin: 0;
	padding: 0;
	height: 100%;
	/* overflow-x: hidden; */
	color: var(--main-color);
	background-color: var(--bg-color);
	font-family: 'Roboto Mono', monospace;
	transition: background-color 0.25s;
	scrollbar-color: var(--sub-color) var(--bg-color);
	scrollbar-width: thin;
}

#app {
	display: grid;
	width: 80%;
	height: 100%;
	margin-left: 10%;
	margin-right: 10%;
	grid-template-rows: auto 1fr auto;
}

::-webkit-scrollbar-thumb {
	background-color: var(--sub-color);
	border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
	background-color: var(--main-color);
}

::-webkit-scrollbar {
	background-color: var(--bg-color);
	width: 5px;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.25s;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
</style>
