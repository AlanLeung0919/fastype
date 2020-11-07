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
			if (this.mode === 'time' && (num < 15 || num > 300)) {
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
	border: none;
	outline: none;
	padding: 0.25em;
	border-radius: 5px;
	background-color: rgba(0, 0, 0, 0.1);
}
</style>
