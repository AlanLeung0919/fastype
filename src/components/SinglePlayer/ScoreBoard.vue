<template>
	<div class="scoreboard" ref="scoreboard">
		<BaseChart v-if="loaded" :height="350" :chartData="chartData" />
		<div class="stat">
			<BaseStat title="wpm" :val="result.wpm" />
			<BaseStat title="acc" :val="result.acc">%</BaseStat>
			<BaseStat title="time" :val="result.time">s</BaseStat>
			<BaseStat title="mode" :val="result.mode" />
			<BaseStat title="date" :val="getDate(result.date, false, true)" />
		</div>
		<div class="redo-wrapper">
			<div
				ref="redo"
				tabindex="0"
				class="btn redo"
				content="restart"
				v-tippy="{ placement: 'bottom' }"
				@click="
					$emit('reset');
					$event.target.blur();
				"
				@keydown.enter="
					$emit('reset');
					$event.target.blur();
				"
			>
				<font-awesome-icon
					icon="redo-alt"
					style="pointer-events: none"
				></font-awesome-icon>
			</div>
		</div>
	</div>
</template>

<script>
import getDate from '@/helper/getDate';
import BaseStat from '@/components/Base/BaseStat';
import BaseChart from '@/components/Base/BaseChart';

export default {
	components: {
		BaseStat,
		BaseChart
	},
	props: {
		result: Object
	},
	data() {
		return {
			loaded: false,
			chartData: {}
		};
	},
	methods: {
		getDate: getDate,
		loadChart() {
			const labels = this.result.wpmPerSec.map((e, i) => i + 1);
			this.chartData = {
				labels: labels,
				datasets: [
					{
						label: 'wpm',
						data: this.result.wpmPerSec,
						borderColor: this.$store.state.theme.mainColor,
						pointBackgroundColor: this.$store.state.theme.mainColor,
						fill: true
					},
					{
						label: 'raw wpm',
						data: this.result.rawWpmPerSec,
						borderColor: this.$store.state.theme.subColor,
						pointBackgroundColor: this.$store.state.theme.subColor,
						borderDash: [5],
						fill: false
					}
				]
			};
			this.loaded = true;
		}
	},
	mounted() {
		this.loadChart();
		this.$refs.redo.focus();
		if (!this.$store.state.authState)
			return this.$store.commit('setAlert', 'sign in to save record');
		this.$http
			.post('record', { record: this.result })
			.then((res) => {
				if (this.result.wpm > res.data.bestWpm)
					this.$store.commit('setAlert', 'new best record!');
			})
			.catch((err) => {
				console.log(err);
			});
	}
};
</script>

<style scoped>
.scoreboard {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	color: var(--sub-color);
	justify-content: space-evenly;
	background-color: var(--bg-color);
}

.stat {
	gap: 1em;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-around;
}

.btn {
	border: none;
	outline: none;
	cursor: pointer;
	transition: 0.1s;
}

.btn:hover {
	color: var(--main-color);
}

.btn:focus {
	color: var(--main-color);
	background-color: var(--sub-color);
}

.redo-wrapper {
	display: flex;
	font-size: 1.25em;
	align-self: center;
}

.redo {
	width: 2.5em;
	height: 2.5em;
	display: flex;
	border-radius: 5px;
	align-items: center;
	justify-content: center;
}
</style>
