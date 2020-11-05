<template>
	<div>
		<input
			v-model="input"
			class="input"
			ref="input"
			:maxlength="maxLen()"
			@focus="inFocus = true"
			@blur="inFocus = false"
			@keydown.ctrl.prevent
			@keydown.exact="checkCap($event)"
		/>
		<div class="text-wrapper" ref="textWrapper" @click="$refs.input.focus()">
			<div class="text">
				<div
					v-for="(word, i) in text"
					:key="'word' + i"
					class="word"
					ref="word"
				>
					<span
						v-for="(char, j) in word"
						:key="'char' + j"
						:class="{
							correct: correct[i][j],
							incorrect: incorrect[i][j]
						}"
						>{{ char }}</span
					>
					<span
						v-for="(ovchar, k) in overflow[i]"
						:key="'ovchar' + k"
						class="overflow"
						>{{ ovchar }}</span
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		propRawText: Array
	},
	data() {
		return {
			inFocus: false,
			started: false,
			input: '',
			rawText: this.propRawText,
			text: [],
			correct: [],
			incorrect: [],
			overflow: [],
			currentWordIdx: 0,
			currentCharIdx: 0,
			error: false,
			typedChars: 0,
			correctChars: 0,
			correctWords: 0
		};
	},
	methods: {
		loadText() {
			const lazyloadLen = 75;
			this.text = this.rawText.slice(0, lazyloadLen);
			this.textLen = this.rawText.length;
			for (let i = 0; i < this.text.length; i++) {
				this.correct[i] = [];
				this.incorrect[i] = [];
				for (let j = 0; j < this.text[i].length; j++) {
					this.correct[i][j] = false;
					this.incorrect[i][j] = false;
				}
			}
			this.rawText = this.rawText.slice(lazyloadLen);
			this.$refs.input.focus();
		},
		maxLen() {
			if (this.started) return this.text[this.currentWordIdx].length + 5;
		},
		checkCap(event) {
			if (event.getModifierState('CapsLock'))
				this.$store.commit('setAlert', 'CapsLock is on!');
		}
	},
	mounted() {
		this.loadText();
	}
};
</script>

<style scoped>
.caret {
	position: fixed;
	width: 2px;
	height: 1.4em;
	background: var(--main-color);
	border-radius: 1em;
	transition: 0.1s;
	transform: translateX(-1px);
}

.input {
	position: absolute;
	width: 0;
	height: 0;
	padding: 0;
	margin: 0;
	outline: none;
	border: none;
}

.correct {
	color: var(--main-color);
}

.incorrect {
	color: #e10000;
	border-bottom: 2.5px solid #e10000;
}

.overflow {
	white-space: pre;
	color: #960000;
	border-bottom: 2.5px solid #960000;
}

.text-wrapper {
	overflow: hidden;
	cursor: default;
	user-select: none;
}

.text {
	display: flex;
	flex-wrap: wrap;
	font-size: 1.1em;
}

.word {
	margin: 0.25em;
}
</style>
