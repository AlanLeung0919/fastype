<template>
	<div class="singleplayer">
		<ScoreBoard v-if="showScore" :result="result" @reset="reset()" />
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
						:mode="mode"
						:time="time"
						:word="word"
						@update="custom"
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
						:mode="mode"
						:time="time"
						:word="word"
						@update="custom"
					/>
				</div>
				<div class="option" v-show="mode === 'quote'" v-if="!started">
					<div class="btn btn-sml" style="visibility: hidden">quote</div>
				</div>
				<div v-if="started" class="live-wpm">
					{{ liveWpm }}
				</div>
			</div>
			<div
				class="caret"
				:style="`left: ${caretLeft}px; top: ${caretTop}px`"
				:class="{
					'caret-blink': blink,
					'caret-show': inFocus,
					'caret-hide': !inFocus
				}"
			></div>
			<input
				v-model="input"
				ref="input"
				class="input"
				:maxlength="maxLen()"
				@focus="inFocus = true"
				@blur="inFocus = false"
				@cut.prevent
				@copy.prevent
				@paste.prevent
				@keydown.ctrl.prevent
				@keydown.exact="checkCap($event)"
			/>
			<div class="text-wrapper" ref="textWrapper" @click="$refs.input.focus()">
				<div class="text">
					<div
						v-for="(word, i) in text"
						ref="word"
						class="word"
						:key="'word' + i"
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
							class="overflow"
							:key="'ovchar' + k"
							>{{ ovchar }}</span
						>
					</div>
				</div>
			</div>
			<div class="redo-wrapper">
				<div
					tabindex="0"
					class="btn redo"
					content="restart"
					v-tippy="{ placement: 'bottom' }"
					@click="
						reset();
						$event.target.blur();
					"
					@keydown.enter="
						reset();
						$event.target.blur();
					"
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
			<div
				class="live-word"
				:style="{
					visibility: started && mode !== 'time' ? 'visible' : 'hidden',
					width: (correctWords / textLen) * 100 + '%'
				}"
			></div>
		</div>
	</div>
</template>

<script>
import ScoreBoard from './ScoreBoard';
import InputNum from './InputNum';

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
			const timeModeWord = 1000;
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
				else this.idleTime = 0;
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
			this.showScore = false;
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
			if (this.showScore) return;
			let inputIdx = this.input.length - 1;
			if (inputIdx === -1) inputIdx = 0;
			setTimeout(() => {
				if (!this.$refs.word) return;
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
		},
		resize() {
			if (this.showScore) return
			this.$refs.input.blur();
			clearTimeout(this.resizeTimer);
			this.resizeTimer = setTimeout(() => {
				this.$refs.input.focus();
			}, 100);
		}
	},
	mounted() {
		this.time = 15;
		this.word = 25;
		this.mode = 'quote';
		window.addEventListener('resize', this.updateCaret);
		window.addEventListener('resize', this.resize);
	},
	beforeDestroy() {
		clearInterval(this.interval);
		window.removeEventListener('resize', this.updateCaret);
		window.removeEventListener('resize', this.resize);
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
				if (
					inputChar === ' ' ||
					(this.correctWords === this.textLen - 1 &&
						inputIdx + 1 === currentWord.length - 1 &&
						this.currentCharIdx === currentWord.length - 2)
				) {
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
	width: 100%;
	height: 100%;
	display: grid;
	position: relative;
	color: var(--sub-color);
	grid-template-rows: 1fr auto 1fr;
}

.config-wrapper {
	gap: 0.5em;
	display: flex;
	user-select: none;
	align-self: center;
	align-items: center;
	padding: 1em 0 1em 0;
	flex-direction: column;
}

.config {
	gap: 0.75em;
	display: flex;
}

.option {
	gap: 0.75em;
	display: flex;
	align-items: center;
	flex-direction: row;
}

.live-wpm {
	font-size: 2.5em;
}

.live-word {
	left: 0;
	bottom: 0;
	width: 100%;
	height: 1em;
	position: fixed;
	visibility: hidden;
	transition: 0.25s;
	background-color: var(--main-color);
}

.caret {
	width: 2px;
	height: 1.5em;
	position: fixed;
	transition: 0.1s;
	border-radius: 5px;
	transform: translateX(-1px);
	background-color: var(--main-color);
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
		opacity: 1;
	}
	50% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}

.input {
	top: 50%;
	left: 50%;
	width: 0;
	height: 0;
	margin: 0;
	padding: 0;
	border: none;
	outline: none;
	position: absolute;
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
	cursor: default;
	overflow: hidden;
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
	align-self: center;
	padding: 1em 0 1em 0;
	justify-content: center;
}

.redo {
	width: 2.5em;
	height: 2.5em;
	display: flex;
	border-radius: 5px;
	align-items: center;
	justify-content: center;
}

.mode-active {
	color: var(--main-color);
}

.btn {
	border: none;
	outline: none;
	cursor: pointer;
	transition: 0.1s;
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
	left: 0;
	bottom: 0;
	width: 100%;
	height: 1em;
	position: fixed;
	visibility: hidden;
	background-color: var(--main-color);
}

.timer-anime {
	animation: timer calc(var(--duration) * 1s) linear;
	transform-origin: left center;
}

@keyframes timer {
	to {
		transform: scaleX(0);
	}
}
</style>
