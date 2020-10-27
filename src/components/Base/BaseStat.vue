<template>
	<div>
		<div class="title">{{ title }}</div>
		<div class="val">{{ val }}<slot></slot></div>
	</div>
</template>

<script>
export default {
	props: {
		title: String,
		val: [Number, String]
	}
};
</script>

<style scoped>
.title {
	color: var(--sub-color);
}

.val {
	font-size: 2.5em;
	color: var(--main-color);
}
</style>
