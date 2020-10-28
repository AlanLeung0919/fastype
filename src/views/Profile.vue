<template>
	<div class="profile">
		<ScrollToTop />
		<ProfileStat :stat="stat" />
		<div class="chart">
			<canvas ref="chart"></canvas>
		</div>
		<ProfileTable :record="record" @load="load()" :avaliable="loadAvaliable" />
	</div>
</template>

<script>
import ProfileStat from '@/components/Profile/ProfileStat.vue';
import ProfileTable from '@/components/Profile/ProfileTable.vue';
import ScrollToTop from '@/components/Base/BaseScrollTop.vue';
import getDate from '@/helper/getDate.js';

export default {
	components: {
		ProfileStat,
		ProfileTable,
		ScrollToTop
	},
	data() {
		return {
			stat: {},
			record: [],
			rawRecord: []
		};
	},
	methods: {
		load() {
			this.record.push(...this.rawRecord.slice(0, 10));
			this.rawRecord = this.rawRecord.slice(10);
		},
		createChart(data) {
			let labels = [];
			data.forEach((e) => {
				if (e === 0 && data.length > 2) data = data.slice(1);
			});
			for (let i = 0; i < data.length; i++) {
				labels.push(getDate(Date.now() - 1000 * 60 * 60 * 24 * (6 - i), true));
			}
			const ctx = this.$refs.chart;
			const chart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: labels,
					datasets: [
						{
							label: 'avg wpm',
							data: data,
							borderColor: this.$store.state.theme.mainColor,
							pointBackgroundColor: this.$store.state.theme.mainColor,
							fill: true
						}
					]
				},
				options: {
					scales: {
						yAxes: [
							{
								ticks: {
									beginAtZero: true
								}
							}
						]
					},
					tooltips: {
						mode: 'x',
						intersect: false
					},
					responsive: true,
					maintainAspectRatio: false
				}
			});
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
				this.createChart(res.data.progression);
				this.load();
				/* console.log(this.record);
				console.log(this.stat);
				console.log(res.data.pastSevenDayAvgWpm) */
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
	gap: 2.5em;
	padding-top: 2.5em;
	padding-bottom: 2.5em;
	/* overflow-anchor: none; */
}

.chart {
	width: 100%;
	height: 50%;
}
</style>
