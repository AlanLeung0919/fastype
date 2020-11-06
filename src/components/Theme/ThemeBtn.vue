<template>
	<div class="theme">
		<div
			v-for="(theme, idx) in themes"
			class="btn"
			:key="idx"
			:class="{ 'btn-selected': currentTheme === theme.name }"
			:style="`background-color: ${theme.bgColor}; color: ${theme.mainColor}`"
			@click="changeTheme(theme.name)"
		>
			<div class="label">{{ theme.name }}</div>
		</div>
	</div>
</template>

<script>
import themeList from '@/assets/theme';

export default {
	props: {
		currentTheme: String
	},
	data() {
		return {
			themes: themeList
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
	gap: 2.5em;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
}

.btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 10em;
	height: 2em;
	border-radius: 5px;
	cursor: pointer;
	user-select: none;
	box-sizing: border-box;
}

.btn-selected {
	border: 1px solid var(--main-color);
}
</style>
