<template>
	<div class="profile">
		<BaseScrollToTop />
		<ProfileStat :stat="stat" />
		<BaseChart v-if="loaded" :height="325" :chartData="chartData" />
		<ProfileDateInput
			:end="endDay"
			:start="startDay"
			@updateEnd="updateEnd"
			@updateStart="updateStart"
		/>
		<ProfileTable :record="record" @load="load" :avaliable="loadAvaliable" />
	</div>
</template>

<script>
import getDate from '@/helper/getDate';
import BaseChart from '@/components/Base/BaseChart';
import BaseScrollToTop from '@/components/Base/BaseScrollTop';
import ProfileStat from '@/components/Profile/ProfileStat';
import ProfileTable from '@/components/Profile/ProfileTable';
import ProfileDateInput from '@/components/Profile/ProfileDateInput';

export default {
	components: {
		BaseChart,
		BaseScrollToTop,
		ProfileStat,
		ProfileTable,
		ProfileDateInput
	},
	data() {
		return {
			loaded: false,
			stat: {},
			record: [],
			rawRecord: [],
			chartData: {},
			rawChartData: [],
			startDay: null,
			endDay: null
		};
	},
	methods: {
		updateStart(val) {
			const date = new Date(val);
			this.startDay = date;
			this.loadChart();
		},
		updateEnd(val) {
			const date = new Date(val);
			this.endDay = date;
			this.loadChart();
		},
		load(loadAll) {
			if (loadAll) {
				this.record.push(...this.rawRecord);
				this.rawRecord = [];
				return;
			}
			this.record.push(...this.rawRecord.slice(0, 10));
			this.rawRecord = this.rawRecord.slice(10);
		},
		loadChart() {
			const start = this.startDay;
			const end = this.endDay;
			start.setHours(0, 0, 0, 0);
			end.setHours(23, 59, 59, 999);
			const dateFilter = this.rawChartData.filter(
				(e) => e.date > start && e.date < end
			);
			dateFilter.reverse();
			const wpmGroup = dateFilter.reduce((wpmGroup, e) => {
				const recordDate = new Date(e.date);
				const date = getDate(recordDate, true);
				if (!wpmGroup[date]) wpmGroup[date] = [];
				wpmGroup[date].push(e.wpm);
				return wpmGroup;
			}, {});
			const accGroup = dateFilter.reduce((accGroup, e) => {
				const recordDate = new Date(e.date);
				const date = getDate(recordDate, true);
				if (!accGroup[date]) accGroup[date] = [];
				accGroup[date].push(e.acc);
				return accGroup;
			}, {});
			const labels = [];
			for (const i in wpmGroup) {
				wpmGroup[i] = Math.round(
					wpmGroup[i].reduce((a, b) => a + b) / wpmGroup[i].length
				);
				labels.push(i);
			}
			for (const i in accGroup)
				accGroup[i] = Math.round(
					accGroup[i].reduce((a, b) => a + b) / accGroup[i].length
				);
			const wpmProgress = Object.keys(wpmGroup).map((e) => wpmGroup[e]);
			const accProgress = Object.keys(accGroup).map((e) => accGroup[e]);
			this.chartData = {
				labels: labels,
				datasets: [
					{
						label: 'avg wpm',
						data: wpmProgress,
						borderColor: this.$store.state.theme.mainColor,
						pointBackgroundColor: this.$store.state.theme.mainColor,
						fill: true
					},
					{
						label: 'avg acc',
						data: accProgress,
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
	computed: {
		loadAvaliable() {
			return this.rawRecord.length !== 0;
		}
	},
	created() {
		this.startDay = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
		this.endDay = new Date();
		this.$http
			.get('record')
			.then((res) => {
				this.stat = res.data.stat;
				this.stat.bestWpm = res.data.stat.bestWpm.wpm;
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
	width: 80%;
	gap: 1.5em;
	display: flex;
	margin: 1.5em auto 1.5em auto;
	flex-direction: column;
}
</style>
