<template>
	<div class="theme">
		<div
			v-for="(theme, idx) in themes"
			class="btn"
			:key="idx"
			:style="`background-color: ${theme.bgColor}; color: ${theme.mainColor}`"
			:class="{ 'btn-selected': currentTheme === theme.name }"
			@click="changeTheme(theme.name)"
		>
			<div class="label">{{ theme.name }}</div>
		</div>
	</div>
</template>

<script>
import themeArr from '@/assets/theme.json';

export default {
	props: {
		currentTheme: String
	},
	data() {
		return {
			themes: themeArr
		};
	},
	methods: {
		changeTheme(name) {
			this.$emit('changeTheme', name);
		}
	}
};
</script>

<style scoped>
.theme {
	display: flex;
	padding-top: 1em;
	flex-wrap: wrap;
	gap: 2.5em;
	justify-content: center;
}

.btn-selected {
	border: 1px solid var(--main-color);
}

.btn {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 10em;
	height: 2em;
	border-radius: 5px;
	cursor: pointer;
	box-sizing: border-box;
	user-select: none;
}
</style>
