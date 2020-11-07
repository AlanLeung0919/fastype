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
import Nav from '@/components/TheNav';
import Foot from '@/components/TheFoot';
import Alert from '@/components/TheAlert';
import setTheme from '@/helper/setTheme';

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
	scrollbar-width: thin;
	transition: background-color 0.25s;
	font-family: 'Roboto Mono', monospace;
	color: var(--main-color);
	background-color: var(--bg-color);
	scrollbar-color: var(--sub-color) var(--bg-color);
}

#app {
	width: 80%;
	height: 100%;
	display: grid;
	margin: 0 auto 0 auto;
	grid-template-rows: auto 1fr auto;
}

::-webkit-scrollbar {
	width: 5px;
	height: 5px;
	background-color: var(--bg-color);
}

::-webkit-scrollbar-thumb {
	border-radius: 5px;
	background-color: var(--sub-color);
}

::-webkit-scrollbar-thumb:hover {
	background-color: var(--main-color);
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
</style>
