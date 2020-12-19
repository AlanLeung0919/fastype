<template>
	<div class="setting">
		<div class="section">
			<div class="title">Theme</div>
			<div
				class="btn-custom"
				@click="toggleCustom()"
				:class="{ 'btn-active': customTheme }"
			>
				custom
			</div>
			<CustomTheme v-if="customTheme" class="btn-selection" />
			<BtnTheme
				v-else
				class="btn-selection"
				@changeTheme="changeTheme"
				:currentTheme="currentTheme"
			/>
		</div>
	</div>
</template>

<script>
import themeList from '@/assets/theme';
import setTheme from '@/helper/setTheme';
import BtnTheme from '@/components/Theme/ThemeBtn';
import CustomTheme from '@/components/Theme/ThemeCustom';

export default {
	components: {
		BtnTheme,
		CustomTheme
	},
	data() {
		return {
			themes: themeList,
			currentTheme: ''
		};
	},
	computed: {
		customTheme() {
			return this.$store.state.theme.name === 'custom';
		}
	},
	methods: {
		saveTheme() {
			if (!this.$store.state.authState) return;
			const theme = localStorage.getItem('theme');
			this.$http.post('theme', { theme: theme });
		},
		changeTheme(theme) {
			this.currentTheme = theme;
		},
		toggleCustom() {
			if (this.customTheme) {
				localStorage.setItem('theme', 'dark');
				const themeName = this.themes.map((e) => e.name);
				const theme = themeName[Math.floor(Math.random() * themeName.length)];
				this.currentTheme = theme;
			} else {
				localStorage.setItem('theme', 'custom');
			}
			setTheme();
		}
	},
	mounted() {
		this.currentTheme = localStorage.getItem('theme');
		window.addEventListener('beforeunload', this.saveTheme);
	},
	beforeDestroy() {
		this.saveTheme();
		window.removeEventListener('beforeunload', this.saveTheme);
	},
	watch: {
		currentTheme(theme) {
			localStorage.setItem('theme', theme);
			setTheme();
		}
	}
};
</script>

<style scoped>
.setting {
	width: 80%;
	display: flex;
	align-items: center;
	flex-direction: column;
	margin: 1.5em auto 1.5em auto;
}

.section {
	gap: 1.5em;
	width: 100%;
	display: grid;
	padding-bottom: 1em;
	grid-template-columns: auto auto;
}

.title {
	font-size: 2em;
	color: var(--sub-color);
}

.btn-custom {
	width: 10em;
	height: 2em;
	display: flex;
	align-items: center;
	justify-content: center;
	align-self: center;
	justify-self: right;
	cursor: pointer;
	user-select: none;
	border-radius: 5px;
	box-sizing: border-box;
	color: var(--main-color);
	background-color: var(--bg-color);
	border: 1px solid var(--main-color);
}

.btn-active {
	background-color: var(--main-color);
	color: var(--bg-color);
}

.btn-selection {
	grid-column: 1 / 3;
}
</style>
