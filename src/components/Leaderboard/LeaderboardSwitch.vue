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
	display: flex;
	align-items: center;
	justify-content: center;
	width: 10em;
	height: 2em;
	border-radius: 5px;
	cursor: pointer;
	user-select: none;
	color: var(--bg-color);
	background-color: var(--sub-color);
}

.btn-active {
	background-color: var(--main-color);
}
</style>
