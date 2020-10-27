<template>
	<div class="top" @click="scrollToTop()">
		<font-awesome-icon icon="arrow-up" />
	</div>
</template>

<script>
export default {
	methods: {
		scrollToTop() {
			window.scrollTo(0, 0);
		}
	}
};
</script>

<style scoped>
.top {
	position: fixed;
	bottom: 2em;
	right: 3em;
	font-size: 2em;
	cursor: pointer;
	width: 1.5em;
	height: 1.5em;
	border-radius: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--sub-color);
	background-color: var(--bg-color);
}

.top:hover {
	color: var(--main-color);
}
</style>
