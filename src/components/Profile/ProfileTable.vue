<template>
	<div class="profile-table">
		<table v-if="record.length > 0">
			<thead>
				<td :class="{ sort: currentSort === 'id' }" @click="sort('id')">#</td>
				<td :class="{ sort: currentSort === 'wpm' }" @click="sort('wpm')">
					wpm
				</td>
				<td :class="{ sort: currentSort === 'acc' }" @click="sort('acc')">
					acc
				</td>
				<td :class="{ sort: currentSort === 'mode' }" @click="sort('mode')">
					mode
				</td>
				<td :class="{ sort: currentSort === 'time' }" @click="sort('time')">
					time
				</td>
				<td :class="{ sort: currentSort === 'date' }" @click="sort('date')">
					date
				</td>
			</thead>
			<tr v-for="(record, idx) in record" :key="idx">
				<td>{{ record.id }}</td>
				<td>{{ record.wpm }}</td>
				<td>{{ record.acc }}%</td>
				<td>{{ record.mode }}</td>
				<td>{{ record.time }}s</td>
				<td>{{ getDate(record.date) }}</td>
			</tr>
		</table>
		<div v-else>No record found</div>
		<div v-if="avaliable" class="load" @click="$emit('load')">load more</div>
	</div>
</template>

<script>
import getDate from '@/helper/getDate.js';

export default {
	props: {
		record: Array,
		avaliable: Boolean
	},
	data() {
		return {
			currentSort: 'id',
			currentSortDir: 1
		};
	},
	methods: {
		getDate: getDate,
		sort(val) {
			if (this.currentSort === val)
				this.currentSortDir = this.currentSortDir === 1 ? -1 : 1;
			this.currentSort = val;
			this.record.sort((a, b) => {
				if (a[this.currentSort] > b[this.currentSort])
					return this.currentSortDir * -1;
				if (a[this.currentSort] < b[this.currentSort])
					return this.currentSortDir * 1;
				return 0;
			});
		}
	}
};
</script>

<style scoped>
.profile-table {
	text-align: center;
}

.sort {
	color: var(--main-color);
}

.load {
	height: 2em;
	padding: 0.1em;
	border-radius: 5px;
	transition: 0.1s;
	user-select: none;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: var(--bg-color);
	background-color: var(--sub-color);
}

.load:hover {
	background-color: var(--main-color);
}

table {
	width: 100%;
	text-align: center;
	table-layout: fixed;
	border-collapse: collapse;
	word-wrap: break-word;
}

thead {
	color: var(--sub-color);
	cursor: pointer;
	user-select: none;
}

thead td:hover {
	color: var(--main-color);
}

td {
	padding-top: 0.1em;
	padding-bottom: 0.1em;
}

td:last-child {
	white-space: pre;
}

tr:nth-child(even) {
	background-color: rgba(0, 0, 0, 0.1);
}
</style>
