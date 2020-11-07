<script>
import { Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
	extends: Line,
	mixins: [reactiveProp],
	props: {
		chartData: Object
	},
	mounted() {
		this.renderChart(this.chartData, {
			scales: {
				yAxes: [
					{
						id: 'wpm',
						type: 'linear',
						position: 'left',
						scaleLabel: {
							display: true,
							labelString: 'wpm'
						}
					}
				]
			},
			tooltips: {
				mode: 'index',
				intersect: false
			},
			animation: {
				duration: 250
			},
			responsive: true,
			maintainAspectRatio: false
		});
	}
};
</script>
