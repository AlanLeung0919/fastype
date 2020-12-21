<template>
	<div>
		<div class="profile" v-if="!loading">
			<BaseScrollToTop />
			<ProfileStat :stat="stat" />
			<ProfileLevel :level="stat.level" :wpm="stat.lastTenAvgWpm" />
			<ProfileSearch />
			<ProfileChart v-if="loaded" :height="325" :chartData="chartData" />
			<ProfileDateInput
				:end="endDay"
				:start="startDay"
				@updateEnd="updateEnd"
				@updateStart="updateStart"
			/>
			<ProfileTable
				:record="record"
				@load="load"
				@exportSheet="exportSheet()"
				:avaliable="loadAvaliable"
			/>
		</div>
		<div v-else class="loading">
			<font-awesome-icon class="fa-spin" icon="circle-notch" size="2x" />
		</div>
	</div>
</template>

<script>
import XLSX from 'xlsx';
import getDate from '@/helper/getDate';
import BaseScrollToTop from '@/components/Base/BaseScrollTop';
import ProfileStat from '@/components/Profile/ProfileStat';
import ProfileChart from '@/components/Profile/ProfileChart';
import ProfileTable from '@/components/Profile/ProfileTable';
import ProfileLevel from '@/components/Profile/ProfileLevel';
import ProfileSearch from '@/components/Profile/ProfileSearch';
import ProfileDateInput from '@/components/Profile/ProfileDateInput';

export default {
	components: {
		ProfileChart,
		BaseScrollToTop,
		ProfileStat,
		ProfileTable,
		ProfileLevel,
		ProfileSearch,
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
			endDay: null,
			loading: true
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
						yAxisID: 'wpm',
						data: wpmProgress,
						borderColor: this.$store.state.theme.mainColor,
						pointBackgroundColor: this.$store.state.theme.mainColor,
						fill: true
					},
					{
						label: 'avg acc',
						data: accProgress,
						yAxisID: 'acc',
						borderColor: this.$store.state.theme.subColor,
						pointBackgroundColor: this.$store.state.theme.subColor,
						borderDash: [5],
						fill: false
					}
				]
			};
			this.loaded = true;
		},
		exportSheet() {
			const wb = XLSX.utils.book_new();
			const stat = [
				{
					avgWpm: this.stat.avgWpm,
					avgAcc: this.stat.avgAcc,
					lastTenAvgWpm: this.stat.lastTenAvgWpm,
					bestWpm: this.stat.bestWpm,
					bestDailyWpm: this.stat.bestDailyWpm.wpm,
					totalTrials: this.stat.totalRace,
					totalTimeUsed: this.stat.totalTime
				}
			];
			const statWs = XLSX.utils.json_to_sheet(stat);
			XLSX.utils.book_append_sheet(wb, statWs, 'stats');
			const recordArr = [];
			this.record.concat(this.rawRecord).forEach((e) => {
				recordArr.push({
					date: getDate(e.date),
					wpm: e.wpm,
					acc: e.acc,
					time: e.time,
					mode: e.mode
				});
			});
			const recordWs = XLSX.utils.json_to_sheet(recordArr);
			XLSX.utils.book_append_sheet(wb, recordWs, 'records');
			XLSX.writeFile(
				wb,
				`fastype-${getDate(Date.now()).replace(/ |:/g, '-')}.xlsx`
			);
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
				this.loading = false;
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

.loading {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
