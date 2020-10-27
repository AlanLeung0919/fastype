<template>
	<div class="custom-theme">
		<div class="color-wrapper">
			background color
			<label
				class="color-display"
				:style="`background-color: ${theme.bgColor}; color: ${theme.mainColor}; border: 1px solid ${theme.mainColor}`"
				for="bgColor"
			>
				{{ theme.bgColor }}
			</label>
			<input
				type="color"
				v-model="themeCache.bgColor"
				class="color-input"
				id="bgColor"
			/>
		</div>
		<div class="color-wrapper">
			primary color
			<label
				class="color-display"
				:style="`background-color: ${theme.mainColor}; color: ${theme.bgColor}`"
				for="mainColor"
			>
				{{ theme.mainColor }}
			</label>
			<input
				type="color"
				v-model="themeCache.mainColor"
				class="color-input"
				id="mainColor"
			/>
		</div>
		<div class="color-wrapper">
			secondary color
			<label
				class="color-display"
				:style="`background-color: ${theme.subColor}; color: ${theme.bgColor}`"
				for="subColor"
			>
				{{ theme.subColor }}
			</label>
			<input
				type="color"
				v-model="themeCache.subColor"
				class="color-input"
				id="subColor"
			/>
		</div>
	</div>
</template>

<script>
import setTheme from '@/helper/setTheme.js';

export default {
	data() {
		return {
			themeCache: {
				name: 'custom',
				bgColor: '',
				mainColor: '',
				subColor: ''
			}
		};
	},
	computed: {
		theme() {
			return this.$store.state.theme;
		}
	},
	methods: {
		saveCustom() {
			if (!this.$store.state.authState) return;
			const custom = JSON.parse(localStorage.getItem('custom'));
			this.$http.post('theme', { custom: custom });
		}
	},
	mounted() {
		this.themeCache.bgColor = this.theme.bgColor;
		this.themeCache.mainColor = this.theme.mainColor;
		this.themeCache.subColor = this.theme.subColor;
		window.addEventListener('beforeunload', this.saveCustom);
	},
	beforeDestroy() {
		this.saveCustom();
		window.removeEventListener('beforeunload', this.saveCustom);
	},
	watch: {
		themeCache: {
			handler(theme) {
				localStorage.setItem('custom', JSON.stringify(this.themeCache));
				setTheme();
			},
			deep: true
		}
	}
};
</script>

<style scoped>
.custom-theme {
	display: flex;
	gap: 5em;
	flex-wrap: wrap;
	justify-content: center;
	width: 100%;
}

.color-wrapper {
	color: var(--sub-color);
	display: flex;
	flex-direction: column;
	gap: 0.5em;
	position: relative;
}

.color-display {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 10em;
	height: 2em;
	border-radius: 5px;
	cursor: pointer;
	box-sizing: border-box;
	user-select: none;
	justify-content: center;
	align-items: center;
}

.color-input {
	visibility: hidden;
	position: absolute;
	top: 75%;
}
</style>
