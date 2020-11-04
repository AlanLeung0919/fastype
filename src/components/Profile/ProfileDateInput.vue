<template>
	<div class="container">
		days of progression
		<div class="input-wrapper">
			<div class="btn" @click="num--">&minus;</div>
			<input @change="num = $event.target.value" :value="num" />
			<div class="btn" @click="num++">&plus;</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			num: null
		};
	},
	props: {
		dateRange: Number
	},
	watch: {
		num(val, oldVal) {
			if (val < 2 || val > 50) {
				this.num = oldVal;
				this.$store.commit('setAlert', 'invalid input');
				return;
			}
			this.$emit('update', val);
		}
	},
	mounted() {
		this.num = this.dateRange;
	}
};
</script>

<style scoped>
.container {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1em;
	flex-direction: column;
}

.input-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5em;
}

.btn {
	width: 1.75em;
	height: 1.75em;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: var(--sub-color);
	color: var(--bg-color);
	border-radius: 5px;
	transition: 0.1s;
	cursor: pointer;
	user-select: none;
}

.btn:hover {
	background-color: var(--main-color);
}

input {
	width: 2.5em;
	height: 2.5em;
	outline: none;
	border: none;
	background-color: rgba(0, 0, 0, 0.05);
	border-radius: 5px;
	text-align: center;
}
</style>
