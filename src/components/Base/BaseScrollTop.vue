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
	display: flex;
	align-items: center;
	justify-content: center;
	width: 1.5em;
	height: 1.5em;
	right: 3em;
	bottom: 2em;
	font-size: 2em;
	border-radius: 100%;
	cursor: pointer;
	color: var(--sub-color);
	background-color: var(--bg-color);
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.top:hover {
	color: var(--main-color);
}
</style>
