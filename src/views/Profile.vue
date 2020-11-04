<template>
	<div class="profile">
		<ScrollToTop />
		<ProfileStat :stat="stat" />
		<BaseChart v-if="loaded" :height="300" :chartData="chartData" />
		<ProfileDateInput @update="update" :dateRange="dateRange" class="input" />
		<ProfileTable :record="record" @load="load()" :avaliable="loadAvaliable" />
	</div>
</template>

<script>
import BaseChart from '@/components/Base/BaseChart.vue';
import ProfileStat from '@/components/Profile/ProfileStat.vue';
import ProfileTable from '@/components/Profile/ProfileTable.vue';
import ProfileDateInput from '@/components/Profile/ProfileDateInput.vue';
import ScrollToTop from '@/components/Base/BaseScrollTop.vue';
import getDate from '@/helper/getDate.js';

export default {
	components: {
		BaseChart,
		ProfileStat,
		ProfileTable,
		ProfileDateInput,
		ScrollToTop
	},
	data() {
		return {
			loaded: false,
			stat: {},
			record: [],
			rawRecord: [],
			chartData: {},
			rawChartData: [],
			dateRange: 7
		};
	},
	methods: {
		update(num) {
			this.dateRange = num;
			this.loadChart();
		},
		load() {
			this.record.push(...this.rawRecord.slice(0, 10));
			this.rawRecord = this.rawRecord.slice(10);
		},
		loadChart() {
			const start = new Date();
			start.setHours(0, 0, 0, 0);
			const date = start.getTime() - 1000 * 60 * 60 * 24 * this.dateRange;
			const dateFilter = this.rawChartData.filter((e) => e.date > date);
			let progression = [];
			dateFilter.reduce((a, e) => {
				const diff = Math.round((e.date - date) / (1000 * 60 * 60 * 24) - 1);
				if (!progression[diff]) progression[diff] = [];
				progression[diff].push(e.wpm);
				return progression;
			}, {});
			for (let i = 0; i < progression.length; i++) {
				if (!progression[i]) progression[i] = [0];
			}
			progression.forEach((e, i) => {
				progression[i] = Math.round(e.reduce((a, b) => a + b) / e.length);
			});
			let labels = [];
			for (let i = 0; i < progression.length; i++)
				labels.push(getDate(Date.now() - 1000 * 60 * 60 * 24 * (progression.length - i - 1), true));
			this.chartData = {
				labels: labels,
				datasets: [
					{
						label: 'avg wpm',
						data: progression,
						borderColor: this.$store.state.theme.mainColor,
						pointBackgroundColor: this.$store.state.theme.mainColor,
						fill: true
					}
				]
			};
			this.loaded = true;
		}
	},
	computed: {
		loadAvaliable() {
			return this.rawRecord.length !== 0;
		}
	},
	mounted() {
		this.$http
			.get('record')
			.then((res) => {
				this.stat = res.data.stat;
				this.rawRecord = res.data.record.reverse();
				this.rawChartData = res.data.record;
				this.loadChart();
				this.load();
			})
			.catch((err) => {
				console.log(err);
			});
	}
};
</script>

<style scoped>
.profile {
	display: flex;
	flex-flow: column;
	width: 80%;
	margin-left: auto;
	margin-right: auto;
	gap: 1.5em;
	padding-top: 2.5em;
	padding-bottom: 2.5em;
}

.input {
	align-self: center;
}
</style>
