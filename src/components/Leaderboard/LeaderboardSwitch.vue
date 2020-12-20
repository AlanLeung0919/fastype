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
	gap: 2.5em;
	display: flex;
	align-items: center;
	justify-content: center;
}

.btn {
	width: 10em;
	height: 2em;
	display: flex;
	cursor: pointer;
	user-select: none;
	border-radius: 5px;
	align-items: center;
	justify-content: center;
	color: var(--bg-color);
	background-color: var(--sub-color);
}

.btn-active {
	background-color: var(--main-color);
}
</style>
