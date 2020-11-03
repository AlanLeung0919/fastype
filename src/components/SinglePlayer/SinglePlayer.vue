<template>
	<div class="singleplayer">
		<ScoreBoard
			v-if="showScore"
			@reset="
				reset();
				showScore = false;
			"
			:result="result"
		/>
		<div v-else class="game">
			<div class="config-wrapper">
				<div class="config" v-if="!started">
					<div
						v-for="modeopt in ['time', 'word', 'quote']"
						class="btn"
						:key="modeopt"
						:class="{
							'mode-active': mode === modeopt
						}"
						@click="mode = modeopt"
					>
						{{ modeopt }}
					</div>
				</div>
				<div class="option" v-show="mode === 'time'" v-if="!started">
					<div
						v-for="timeopt in [15, 30, 60, 120]"
						class="btn btn-sml"
						:key="timeopt"
						:class="{
							'mode-active': time === timeopt
						}"
						@click="time = timeopt"
					>
						{{ timeopt }}
					</div>
					<div
						class="btn btn-sml"
						:class="{
							'mode-active': ![15, 30, 60, 120].includes(time)
						}"
						@click="time += 5"
					>
						custom
					</div>
					<InputNum
						v-if="![15, 30, 60, 120].includes(time)"
						@update="custom"
						:mode="mode"
						:time="time"
						:word="word"
					/>
				</div>
				<div class="option" v-show="mode === 'word'" v-if="!started">
					<div
						v-for="wordopt in [25, 50, 100]"
						class="btn btn-sml"
						:key="wordopt"
						:class="{
							'mode-active': word === wordopt
						}"
						@click="
							word = wordopt;
							getText();
						"
					>
						{{ wordopt }}
					</div>
					<div
						class="btn btn-sml"
						:class="{
							'mode-active': ![25, 50, 100].includes(word)
						}"
						@click="
							word += 5;
							getText();
						"
					>
						custom
					</div>
					<InputNum
						v-if="![25, 50, 100].includes(word)"
						@update="custom"
						:mode="mode"
						:time="time"
						:word="word"
					/>
				</div>
				<div class="option" v-show="mode === 'quote'" v-if="!started">
					<div class="btn btn-sml" style="visibility: hidden">quote</div>
				</div>
				<div v-if="started" class="wpm">
					{{ liveWpm }}
				</div>
			</div>
			<div
				class="caret"
				:style="`left: ${caretLeft}px; top: ${caretTop}px`"
				:class="{
					'caret-show': inFocus,
					'caret-hide': !inFocus,
					'caret-blink': blink
				}"
			></div>
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
				<div
					class="text"
					:class="{ 'reload-anime': reload }"
					@animationend="reload = false"
				>
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
			<div class="redo-wrapper">
				<div
					class="btn redo"
					tabindex="0"
					@click="
						reset();
						$event.target.blur();
					"
					@keydown.enter="
						reset();
						$event.target.blur();
					"
					@keydown.space="
						reset();
						$event.target.blur();
					"
					content="restart"
					v-tippy="{ placement: 'bottom' }"
				>
					<font-awesome-icon
						icon="redo-alt"
						style="pointer-events: none"
					></font-awesome-icon>
				</div>
			</div>
			<div
				class="timer"
				:class="{
					'timer-anime': started && mode === 'time'
				}"
				:style="
					started && mode === 'time'
						? `visibility: visible; --duration: ${time}`
						: 'visibility: hidden'
				"
			></div>
		</div>
	</div>
</template>

<script>
import ScoreBoard from './ScoreBoard.vue';
import InputNum from './InputNum.vue';

export default {
	components: {
		ScoreBoard,
		InputNum
	},
	data() {
		return {
			mode: '',
			word: 0,
			time: 0,
			rawText: [],
			text: [],
			correct: [],
			incorrect: [],
			overflow: [],
			input: '',
			result: {},
			showScore: false,
			blink: false,
			inFocus: false,
			reload: false,
			started: false,
			error: false,
			lastInput: '',
			idleTime: 0,
			time: 0,
			wpmPerSec: [],
			rawWpmPerSec: [],
			liveWpm: 0,
			textLen: 0,
			typedChars: 0,
			correctChars: 0,
			correctWords: 0,
			currentWordIdx: 0,
			currentCharIdx: 0,
			caretTop: 0,
			caretLeft: 0,
			top: 0
		};
	},
	methods: {
		getText() {
			let n = 0;
			const timeModeWord = 500;
			const lazyloadLen = 75;
			if (this.mode === 'time') n = timeModeWord;
			if (this.mode === 'word') n = this.word;
			if (this.mode === 'quote') n = 0;
			this.$http
				.get(`text?length=${n}`)
				.then((res) => {
					this.rawText = res.data.text;
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
					setTimeout(() => {
						const word = this.$refs.word;
						if (word.length === 0) return;
						const style = getComputedStyle(word[0]);
						const height =
							(word[0].clientHeight +
								parseInt(style.marginTop) +
								parseInt(style.marginBottom)) *
							3;
						this.$refs.textWrapper.style.height = height + 'px';
						this.updateCaret();
						setTimeout(() => {
							this.$refs.input.focus();
							this.blink = true;
						}, 100);
					}, 0);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		timer() {
			if (this.started) return;
			let start = Date.now();
			this.interval = setInterval(() => {
				if (this.lastInput === this.input) this.idleTime++;
				if (this.idleTime === 10) {
					this.reset();
					this.$store.commit('setAlert', 'test invalid, afk detected');
				}
				this.lastInput = this.input;
				let time = Math.round((Date.now() - start) / 1000);
				const wpm = Math.round(this.correctChars / 5 / (time / 60));
				const rawWpm = Math.round(this.typedChars / 5 / (time / 60));
				this.liveWpm = wpm;
				this.wpmPerSec.push(wpm);
				this.rawWpmPerSec.push(rawWpm);
				if (this.mode === 'time' && this.time === time) {
					this.finish();
				}
			}, 1000);
		},
		start() {
			this.timer();
			this.started = true;
			this.blink = false;
		},
		reset() {
			this.getText();
			clearInterval(this.interval);
			this.started = false;
			this.rawText = [];
			this.text = [];
			this.correct = [];
			this.incorrect = [];
			this.overflow = [];
			this.wpmPerSec = [];
			this.rawWpmPerSec = [];
			this.input = '';
			this.reload = true;
			this.error = false;
			this.typedChars = 0;
			this.correctChars = 0;
			this.result = {};
			this.lastInput = '';
			this.idleTime = 0;
			this.liveWpm = 0;
			this.textLen = 0;
			this.correctWords = 0;
			this.currentWordIdx = 0;
			this.currentCharIdx = 0;
		},
		finish() {
			clearInterval(this.interval);
			const acc = Math.round((this.correctChars / this.typedChars) * 100);
			//console.log(this.liveWpm, this.wpmPerSec, acc);
			if (acc < 75) {
				this.reset();
				this.$store.commit('setAlert', `test invalid, accuracy: ${acc}%`);
				return;
			}
			this.result = {
				wpm: this.liveWpm,
				acc: acc,
				time: this.wpmPerSec.length,
				wpmPerSec: this.wpmPerSec,
				rawWpmPerSec: this.rawWpmPerSec,
				mode: this.mode,
				date: Date.now()
			};
			this.started = false;
			this.showScore = true;
			//console.log(this.result);
		},
		maxLen() {
			if (this.started) return this.text[this.currentWordIdx].length + 5;
		},
		updateCaret() {
			let inputIdx = this.input.length - 1;
			if (inputIdx === -1) inputIdx = 0;
			setTimeout(() => {
				if (!this.$refs.word[this.currentWordIdx]) return;
				const word = this.$refs.word[this.currentWordIdx].children[inputIdx];
				if (!word) return;
				const top = word.getBoundingClientRect().top;
				let right;
				if (this.input.length === 0) right = word.getBoundingClientRect().left;
				else right = word.getBoundingClientRect().right;
				this.caretTop = top;
				this.caretLeft = right;
			}, 0);
		},
		updateRow() {
			const currentTop = this.$refs.word[
				this.currentWordIdx
			].getBoundingClientRect().top;
			if (
				currentTop !== this.top &&
				this.top !== 0 &&
				this.currentWordIdx !== 0 &&
				this.overflow[this.currentWordIdx].length === 0
			) {
				let n = this.currentWordIdx;
				this.text = this.text.slice(n);
				this.overflow = this.overflow.slice(n);
				this.correct = this.correct.slice(n);
				this.incorrect = this.incorrect.slice(n);
				this.currentWordIdx -= n;
			}
			this.top = currentTop;
		},
		checkCap(event) {
			if (event.getModifierState('CapsLock'))
				this.$store.commit('setAlert', 'CapsLock is on!');
		},
		custom(val) {
			if (this.mode === 'time') this.time = val;
			else {
				this.word = val;
				this.getText();
			}
			this.$refs.input.focus();
		}
	},
	mounted() {
		this.mode = 'quote'; //TODO: get config from database
		this.word = 25;
		this.time = 15;
		window.addEventListener('resize', this.updateCaret);
	},
	beforeDestroy() {
		this.reset();
		window.removeEventListener('resize', this.updateCaret);
	},
	watch: {
		mode(newMode, oldMode) {
			this.getText();
		},
		currentWordIdx() {
			if (this.rawText.length === 0) return;
			const newWord = this.rawText.slice(0, 1);
			this.text.push(...newWord);
			this.rawText = this.rawText.slice(1);
			let correctWordArr = [];
			let incorrectWordArr = [];
			for (let i = 0; i < newWord[0].length; i++) {
				correctWordArr[i] = false;
				incorrectWordArr[i] = false;
			}
			this.correct.push(correctWordArr);
			this.incorrect.push(incorrectWordArr);
		},
		input(newInput, oldInput) {
			if (this.textLen === 0) return;
			if (!this.started && this.input !== '') this.start();
			if (!this.started) return;
			if (!this.overflow[this.currentWordIdx])
				this.overflow[this.currentWordIdx] = '';
			const currentWord = this.text[this.currentWordIdx] + ' ';
			const currentChar = currentWord[this.currentCharIdx];
			const inputChar = newInput.slice(-1);
			const inputIdx = this.input.length - 1;
			const word = this.$refs.word[this.currentWordIdx];
			if (inputChar === currentChar && inputIdx === this.currentCharIdx) {
				if (inputChar === ' ') {
					this.correctChars++;
					this.typedChars++;
					this.correctWords++;
					this.currentWordIdx++;
					this.currentCharIdx = 0;
					this.input = '';
					return;
				}
				this.correct[this.currentWordIdx][inputIdx] = true;
				this.currentCharIdx++;
				this.correctChars++;
			}
			if (this.correctWords === this.textLen) {
				return this.finish();
			}
			if (newInput.length < oldInput.length) {
				this.correct[this.currentWordIdx][inputIdx + 1] = false;
				this.incorrect[this.currentWordIdx][inputIdx + 1] = false;
				if (
					oldInput.slice(-1) === currentWord[this.currentCharIdx - 1] &&
					oldInput.length === this.currentCharIdx
				)
					this.currentCharIdx--;
				this.overflow[this.currentWordIdx] = this.overflow[
					this.currentWordIdx
				].slice(0, -1);
			} else {
				this.typedChars++;
			}
			if (this.input === currentWord.substring(0, this.input.length)) {
				this.error = false;
			} else {
				this.error = true;
			}
			if (this.error) {
				if (inputIdx + 1 > currentWord.length - 1 && newInput > oldInput) {
					this.overflow[this.currentWordIdx] += inputChar;
				} else if (!this.overflow[this.currentWordIdx]) {
					this.incorrect[this.currentWordIdx][inputIdx] = true;
				}
			}
			this.updateCaret();
			this.updateRow();
		}
	}
};
</script>

<style scoped>
.singleplayer {
	width: 100%;
	height: 100%;
}

.game {
	display: grid;
	grid-template-rows: 1fr auto 1fr;
	color: var(--sub-color);
	position: relative;
	width: 100%;
	height: 100%;
}

.config-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	align-self: center;
	padding-top: 1.5em;
	padding-bottom: 1.5em;
	gap: 0.5em;
	transition: opacity 0.25s;
	user-select: none;
}

.config {
	display: flex;
	gap: 0.75em;
}

.option {
	display: flex;
	flex-direction: row;
	gap: 0.5em;
	align-items: center;
}

.wpm {
	font-size: 2.5em;
}

.caret {
	position: fixed;
	width: 2px;
	height: 1.4em;
	background: var(--main-color);
	border-radius: 1em;
	transition: 0.1s;
	transform: translateX(-1px);
}

.caret-hide {
	visibility: hidden;
}

.caret-show {
	visibility: visible;
}

.caret-blink {
	animation: blink 1s infinite;
}

@keyframes blink {
	0% {
		opacity: 0;
	}
	50% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
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
	color: #c83232;
	border-bottom: 2px solid #c83232;
}

.overflow {
	color: #7d3232;
	white-space: pre;
	border-bottom: 2px solid #7d3232;
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

.redo-wrapper {
	display: flex;
	font-size: 1.25em;
	padding-top: 1.5em;
	padding-bottom: 1.5em;
	align-self: center;
	justify-content: center;
}

.redo {
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 5px;
	width: 2.5em;
	height: 2.5em;
}

.mode-active {
	color: var(--main-color);
}

.btn {
	cursor: pointer;
	transition: 0.25s;
	outline: none;
	border: none;
}

.btn-sml {
	font-size: 0.9em;
}

.btn:hover {
	color: var(--main-color);
}

.btn:focus {
	color: var(--main-color);
	background-color: var(--sub-color);
}

.timer {
	visibility: hidden;
	position: fixed;
	height: 0.75em;
	width: 100%;
	left: 0px;
	bottom: 0px;
	background-color: var(--main-color);
}

.timer-anime {
	animation: timer calc(var(--duration) * 1s) linear;
	transform-origin: left center;
}

.reload-anime {
	animation: reload 0.25s;
}

@keyframes reload {
	0%,
	50% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}

@keyframes timer {
	to {
		transform: scaleX(0);
	}
}
</style>
