<template>
	<div class="setting">
		<div class="section">
			<div class="title">Theme</div>
			<div
				class="btn"
				@click="toggleCustom()"
				:class="{ 'btn-active': customTheme }"
			>
				custom
			</div>
			<CustomTheme v-if="customTheme" class="btn-selection" />
			<BtnTheme
				v-else
				:currentTheme="currentTheme"
				@changeTheme="changeTheme"
				class="btn-selection"
			/>
		</div>
	</div>
</template>

<script>
import setTheme from '@/helper/setTheme.js';
import themeArr from '@/assets/theme.json';
import BtnTheme from '@/components/Theme/ThemeBtn.vue';
import CustomTheme from '@/components/Theme/ThemeCustom.vue';

export default {
	components: {
		BtnTheme,
		CustomTheme
	},
	data() {
		return {
			themes: themeArr,
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
		changeTheme(name) {
			this.currentTheme = name;
		},
		toggleCustom() {
			if (this.customTheme) {
				localStorage.setItem('theme', 'dark');
				this.currentTheme = 'dark';
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
	display: flex;
	flex-direction: column;
	margin-top: 1em;
	align-items: center;
	width: 80%;
	margin-left: auto;
	margin-right: auto;
}

.section {
	padding-top: 1em;
	display: grid;
	grid-template-columns: auto auto;
	gap: 1em;
	width: 100%;
}

.title {
	font-size: 2em;
	color: var(--sub-color);
}

.btn {
	align-self: center;
	justify-self: right;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 10em;
	height: 2em;
	border-radius: 5px;
	cursor: pointer;
	box-sizing: border-box;
	background-color: var(--bg-color);
	color: var(--main-color);
	transition: 0.1s;
	border: 1px solid var(--main-color);
	user-select: none;
}

.btn-active {
	background-color: var(--main-color);
	color: var(--bg-color);
}

.btn-selection {
	grid-column: 1 / 3;
}
</style>
