<template>
	<input v-model.number.lazy="num" type="number" class="input-num" step="5" />
</template>

<script>
export default {
	props: {
		mode: String,
		time: Number,
		word: Number
	},
	data() {
		return {
			num: null
		};
	},
	mounted() {
		if (this.mode === 'time') this.num = this.time;
		else this.num = this.word;
	},
	watch: {
		num(num, oldnum) {
			if (typeof num !== 'number') {
				this.$store.commit('setAlert', 'invalid input');
				this.num = oldnum;
				return;
			}
			if (this.mode === 'time' && (num < 10 || num > 300)) {
				this.$store.commit('setAlert', 'invalid time');
				this.num = oldnum;
				return;
			}
			if (this.mode === 'word' && (num < 10 || num > 1000)) {
				this.$store.commit('setAlert', 'invalid word');
				this.num = oldnum;
				return;
			}
			this.$emit('update', num);
		}
	}
};
</script>

<style scoped>
.input-num {
	width: 3em;
	border-radius: 2px;
	outline: none;
	color: var(--main-color);
	background-color: var(--bg-color);
	border: 1px solid var(--main-color);
}
</style>
