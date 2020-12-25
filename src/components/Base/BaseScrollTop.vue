<template>
	<div class="top" @click="scrollToTop">
		<font-awesome-icon icon="arrow-up" />
	</div>
</template>

<script>
export default {
	methods: {
		scrollToTop() {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
};
</script>

<style scoped>
.top {
	width: 1.5em;
	right: 2.5em;
	height: 1.5em;
	bottom: 2.5em;
	display: flex;
	font-size: 2em;
	position: fixed;
	cursor: pointer;
	transition: 0.1s;
	border-radius: 50%;
	align-items: center;
	justify-content: center;
	color: var(--sub-color);
	background-color: var(--bg-color);
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
}

.top:hover {
	color: var(--main-color);
}
</style>
