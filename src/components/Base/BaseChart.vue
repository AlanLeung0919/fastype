<script>
import { Line } from 'vue-chartjs';

export default {
	extends: Line,
	props: {
		chartData: Object
	},
	mounted() {
		this.renderChart(this.chartData, {
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
		});
	}
};
</script>
