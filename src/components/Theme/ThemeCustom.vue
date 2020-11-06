<template>
	<div class="custom-theme">
		<div class="color-wrapper">
			background color
			<label
				for="bgColor"
				class="color-display"
				:style="`background-color: ${theme.bgColor}; color: ${theme.mainColor}; border: 1px solid ${theme.mainColor}`"
			>
				{{ theme.bgColor }}
			</label>
			<input
				v-model="themeCache.bgColor"
				type="color"
				class="color-input"
				id="bgColor"
			/>
		</div>
		<div class="color-wrapper">
			primary color
			<label
				for="mainColor"
				class="color-display"
				:style="`background-color: ${theme.mainColor}; color: ${theme.bgColor}`"
			>
				{{ theme.mainColor }}
			</label>
			<input
				v-model="themeCache.mainColor"
				type="color"
				class="color-input"
				id="mainColor"
			/>
		</div>
		<div class="color-wrapper">
			secondary color
			<label
				for="subColor"
				class="color-display"
				:style="`background-color: ${theme.subColor}; color: ${theme.bgColor}`"
			>
				{{ theme.subColor }}
			</label>
			<input
				v-model="themeCache.subColor"
				type="color"
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
	gap: 7.5em;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
}

.color-wrapper {
	gap: 0.5em;
	display: flex;
	position: relative;
	flex-direction: column;
	color: var(--sub-color);
}

.color-display {
	display: flex;
	align-items: center;
	justify-content: center;
	align-items: center;
	justify-content: center;
	width: 10em;
	height: 2em;
	border-radius: 5px;
	cursor: pointer;
	user-select: none;
	box-sizing: border-box;
}

.color-input {
	top: 75%;
	position: absolute;
	visibility: hidden;
}
</style>
