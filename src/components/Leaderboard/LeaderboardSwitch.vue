<template>
	<div class="switch">
		<div
			class="btn"
			:class="{ 'btn-active': table === 'bestWpm' }"
			@click="updateTable('bestWpm')"
		>
			all time
		</div>
		<div
			class="btn"
			:class="{ 'btn-active': table === 'bestDailyWpm' }"
			@click="updateTable('bestDailyWpm')"
		>
			daily
		</div>
	</div>
</template>

<script>
export default {
	props: {
		table: String
	},
	methods: {
		updateTable(val) {
			this.$emit('update', val);
		}
	}
};
</script>

<style scoped>
.switch {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 1em;
}

.btn {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 10em;
	height: 2em;
	border-radius: 5px;
	cursor: pointer;
	transition: 0.25s;
	background-color: var(--sub-color);
}

.btn-active {
	background-color: var(--main-color);
	color: var(--bg-color);
}
</style>
