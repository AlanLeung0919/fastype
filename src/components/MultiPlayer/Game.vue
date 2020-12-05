<template>
	<div class="game">
		<Players :players="this.players" />
		<div
			v-if="started"
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
			:disabled="!started"
			@focus="inFocus = true"
			@blur="inFocus = false"
			@cut.prevent
			@copy.prevent
			@paste.prevent
			@keydown.ctrl.prevent
			@keydown.exact="checkCap($event)"
		/>
		<div
			v-if="!finished"
			class="text-wrapper"
			:style="`height: ${height}px`"
			@click="$refs.input.focus()"
		>
			<div class="overlay" v-if="!started && !finished">
				<div v-if="waiting">
					waiting for players
					<font-awesome-icon class="fa-spin" icon="circle-notch" />
				</div>
				<div v-if="countdown">starting in {{ countdownTime }}s</div>
			</div>
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
		<div v-else class="stat">
			<BaseStat title="rank" :val="result.rank" />
			<BaseStat title="wpm" :val="result.wpm" />
			<BaseStat title="acc" :val="result.acc">%</BaseStat>
			<BaseStat title="time" :val="result.time">s</BaseStat>
			<BaseStat title="mode" :val="result.mode" />
			<BaseStat title="date" :val="getDate(result.date, false, true)" />
		</div>
		<div class="bottom-wrapper">
			<div style="display: flex">
				<div
					tabindex="0"
					class="btn leave"
					content="leave room"
					v-tippy="{ placement: 'bottom' }"
					@click="
						$emit('leave');
						$event.target.blur();
					"
					@keydown.enter="
						$emit('leave');
						$event.target.blur();
					"
				>
					<font-awesome-icon
						icon="door-open"
						style="pointer-events: none"
					></font-awesome-icon>
				</div>
				<div
					v-if="isPrivate && !voted"
					tabindex="0"
					class="btn leave"
					content="vote to start"
					v-tippy="{ placement: 'bottom' }"
					@click="
						voted = true;
						$emit('vote');
						$event.target.blur();
					"
					@keydown.enter="
						voted = true;
						$emit('vote');
						$event.target.blur();
					"
				>
					<font-awesome-icon
						icon="check"
						style="pointer-events: none"
					></font-awesome-icon>
				</div>
			</div>
			<div
				v-if="isPrivate"
				class="roomid"
				content="click to copy"
				v-tippy="{ placement: 'bottom' }"
				@click="copyId()"
			>
				{{ roomId }}
			</div>
		</div>
	</div>
</template>

<script>
import Players from './Players';
import BaseStat from '@/components/Base/BaseStat';
import getDate from '@/helper/getDate';

export default {
	components: {
		Players,
		BaseStat
	},
	props: {
		players: Array,
		propRawText: Array,
		waiting: Boolean,
		countdown: Boolean,
		startTime: Number,
		rank: Number,
		roomId: String,
		isPrivate: Boolean
	},
	data() {
		return {
			voted: false,
			rawText: this.propRawText,
			started: false,
			finished: false,
			input: '',
			countdownTime: 0,
			caretLeft: 0,
			caretTop: 0,
			blink: false,
			inFocus: false,
			text: [],
			correct: [],
			incorrect: [],
			overflow: [],
			typedChars: 0,
			correctChars: 0,
			correctWords: 0,
			currentWordIdx: 0,
			currentCharIdx: 0,
			top: 0,
			error: false,
			liveWpm: 0,
			textLen: 0,
			wpmPerSec: [],
			result: {},
			height: 0
		};
	},
	methods: {
		getDate: getDate,
		copyId() {
			navigator.clipboard.writeText(this.roomId);
			this.$store.commit('setAlert', 'copied room id');
		},
		initText() {
			const lazyloadLen = 75;
			this.textLen = this.rawText.length;
			this.text = this.rawText.slice(0, lazyloadLen);
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
				//this.$refs.textWrapper.style.height = height + 'px';
				this.height = height;
				this.updateCaret();
				setTimeout(() => {
					this.$refs.input.focus();
					this.blink = true;
				}, 100);
			}, 0);
		},
		timer() {
			if (this.started) return;
			const start = Date.now();
			this.interval = setInterval(() => {
				const time = Math.round((Date.now() - start) / 1000);
				const wpm = Math.round(this.correctChars / 5 / (time / 60));
				const progress = Math.round((this.correctWords / this.textLen) * 100);
				this.$emit('gameUpdate', { wpm: wpm, progress: progress });
				this.liveWpm = wpm;
				this.wpmPerSec.push(wpm);
			}, 1000);
		},
		start() {
			this.timer();
			this.started = true;
			this.blink = false;
			this.$nextTick(() => {
				this.$refs.input.focus();
			});
		},
		finish() {
			this.started = false;
			clearInterval(this.interval);
			this.$emit('gameUpdate', { wpm: this.liveWpm, progress: 100 });
			this.$emit('playerFinish');
		},
		maxLen() {
			if (this.started) return this.text[this.currentWordIdx].length + 5;
		},
		updateCaret() {
			if (this.finished) return;
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
		}
	},
	mounted() {
		this.initText();
		window.addEventListener('resize', this.updateCaret);
	},
	beforeDestroy() {
		clearInterval(this.interval);
		clearInterval(this.countdownInterval);
		window.removeEventListener('resize', this.updateCaret);
	},
	watch: {
		rank(val) {
			if (val !== 0) {
				this.finished = true;
				const acc = Math.round((this.correctChars / this.typedChars) * 100);
				this.result = {
					rank: val,
					wpm: this.liveWpm,
					acc: acc,
					time: this.wpmPerSec.length,
					wpmPerSec: this.wpmPerSec,
					mode: 'race',
					date: Date.now()
				};
			}
		},
		countdown(val) {
			if (val) {
				this.countdownTime = Math.round((this.startTime - Date.now()) / 1000);
				this.countdownInterval = setInterval(() => {
					this.countdownTime = Math.round((this.startTime - Date.now()) / 1000);
					console.log(this.countdownTime);
					if (this.countdownTime < 1) {
						clearInterval(this.countdownInterval);
						this.start();
						this.$emit('start');
					}
				}, 1000);
			}
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
.game {
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-rows: 1fr auto 1fr;
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

.overlay {
	width: 100%;
	height: 100%;
	z-index: 999;
	/* color: var(--main-color) !important;
	background-color: var(--bg-color); */
	background-color: rgba(0, 0, 0, 0.9);
	position: absolute;
	border-radius: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #ffffff;
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

.text-wrapper {
	cursor: default;
	overflow: hidden;
	user-select: none;
	color: var(--sub-color);
	position: relative;
}

.text {
	display: flex;
	flex-wrap: wrap;
	font-size: 1.1em;
}

.word {
	margin: 0.25em;
}

.stat {
	gap: 1em;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-around;
}

.bottom-wrapper {
	gap: 0.5em;
	display: flex;
	font-size: 1.25em;
	align-self: center;
	padding: 1em 0 1em 0;
	align-items: center;
	flex-direction: column;
	justify-content: center;
}

.leave {
	width: 2.5em;
	height: 2.5em;
	display: flex;
	border-radius: 5px;
	align-items: center;
	justify-content: center;
}

.roomid {
	color: var(--sub-color);
	cursor: pointer;
	outline: none;
	font-size: 0.75em;
	transition: 0.1s;
}

.roomid:hover {
	color: var(--main-color);
}

.btn {
	border: none;
	outline: none;
	cursor: pointer;
	transition: 0.1s;
	color: var(--sub-color);
}

.btn:hover {
	color: var(--main-color);
}

.btn:focus {
	color: var(--main-color);
	background-color: var(--sub-color);
}
</style>
