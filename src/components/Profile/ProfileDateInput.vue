<template>
	<div class="container">
		<div class="date-wrapper">
			<div class="input-wrapper">
				start day
				<input type="date" v-model="startDay" />
			</div>
			<div class="input-wrapper">
				end day
				<input type="date" v-model="endDay" />
			</div>
		</div>
		<div class="reminder">&ast; inactive days not included</div>
	</div>
</template>

<script>
export default {
	props: {
		start: Date,
		end: Date
	},
	data() {
		return {
			startDay: this.start,
			endDay: this.end
		};
	},
	methods: {
		formatDate(date) {
			return (
				date.getFullYear() +
				'-' +
				(date.getMonth() + 1).toString().padStart(2, '0') +
				'-' +
				date.getDate().toString().padStart(2, '0')
			);
		}
	},
	watch: {
		startDay(val) {
			this.$emit('updateStart', val);
		},
		endDay(val) {
			this.$emit('updateEnd', val);
		}
	},
	mounted() {
		this.startDay = this.formatDate(this.startDay);
		this.endDay = this.formatDate(this.endDay);
	}
};
</script>

<style scoped>
.container {
	gap: 1em;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	user-select: none;
}

.date-wrapper {
	gap: 2.5em;
	display: flex;
	align-items: center;
	justify-content: center;
}

.input-wrapper {
	gap: 0.5em;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
}

.reminder {
	font-size: 0.5em;
}

input {
	border: none;
	outline: none;
	padding: 0.25em;
	border-radius: 5px;
	color: var(--main-color);
	background-color: rgba(0, 0, 0, 0.05);
}
</style>
