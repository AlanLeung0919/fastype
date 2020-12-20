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
			num: this.mode === 'time' ? this.time : this.word
		};
	},
	watch: {
		num(num, oldnum) {
			if (!oldnum) return;
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
		},
		word(num, oldnum) {
			this.num = num;
		},
		time(num, oldnum) {
			this.num = num;
		}
	}
};
</script>

<style scoped>
.input-num {
	width: 3.25em;
	border: none;
	outline: none;
	padding: 0.25em;
	border-radius: 5px;
	color: var(--main-color);
	background-color: rgba(0, 0, 0, 0.1);
}
</style>
