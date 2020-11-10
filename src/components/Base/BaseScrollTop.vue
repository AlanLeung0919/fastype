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
	right: 2.5em;
	bottom: 2.5em;
	width: 1.5em;
	height: 1.5em;
	display: flex;
	font-size: 2em;
	position: fixed;
	cursor: pointer;
	border-radius: 50%;
	align-items: center;
	justify-content: center;
	color: var(--sub-color);
	background-color: var(--bg-color);
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.top:hover {
	color: var(--main-color);
}
</style>
