<template>
	<div class="profile">
		<ScrollToTop />
		<ProfileStat :stat="stat" />
		<BaseChart v-if="loaded" :height="250" :chartData="chartData" />
		<ProfileTable :record="record" @load="load()" :avaliable="loadAvaliable" />
	</div>
</template>

<script>
import BaseChart from '@/components/Base/BaseChart.vue';
import ProfileStat from '@/components/Profile/ProfileStat.vue';
import ProfileTable from '@/components/Profile/ProfileTable.vue';
import ScrollToTop from '@/components/Base/BaseScrollTop.vue';
import getDate from '@/helper/getDate.js';

export default {
	components: {
		BaseChart,
		ProfileStat,
		ProfileTable,
		ScrollToTop
	},
	data() {
		return {
			loaded: false,
			stat: {},
			record: [],
			rawRecord: [],
			chartData: {},
			chartOption: {}
		};
	},
	methods: {
		load() {
			this.record.push(...this.rawRecord.slice(0, 10));
			this.rawRecord = this.rawRecord.slice(10);
		},
		loadChart(data) {
			let labels = [];
			for (let i = 0; i < data.length; i++)
				labels.push(getDate(Date.now() - 1000 * 60 * 60 * 24 * (6 - i), true));
			this.chartData = {
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
				this.loadChart(res.data.progression);
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
	gap: 2.5em;
	padding-top: 2.5em;
	padding-bottom: 2.5em;
	/* overflow-anchor: none; */
}
</style>
