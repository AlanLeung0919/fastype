<template>
	<div class="wrapper">
		<img :src="getBadge(level - 1)" class="badge-sml" />
		<div class="level">
			<div class="progress" :style="getWidth()">
				<div class="text">lv.{{ level }}</div>
				<img :src="getBadge(level)" class="badge" />
			</div>
		</div>
		<img :src="getBadge(level + 1)" class="badge-sml" />
		<font-awesome-icon
			class="info"
			icon="info-circle"
			content="level based on avg wpm (last 10)<br>
			increases per 10 wpm<br>
			max lv.12 (>109 wpm)
			"
			v-tippy="{
				placement: 'bottom',
				trigger: 'click',
				boundary: 'HTMLElement'
			}"
		/>
	</div>
</template>

<script>
export default {
	props: {
		level: Number,
		wpm: Number
	},
	methods: {
		getBadge(level) {
			if (level > 0 && level < 13)
				return require(`@/assets/badges/${level}.svg`);
		},
		getWidth() {
			if (this.level === 12) return `width: 100%`;
			return `width: ${(this.wpm % 10) * 10}%`;
		}
	}
};
</script>

<style scoped>
.wrapper {
	gap: 0.5em;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.info {
	font-size: 1em;
	color: var(--sub-color);
	transition: 0.1s;
	cursor: pointer;
	outline: none;
}

.info:hover {
	color: var(--main-color);
}

.level {
	width: 85%;
	height: 1em;
	display: flex;
	border-radius: 5px;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.1);
}

.progress {
	height: 1em;
	display: flex;
	min-width: 100px;
	align-items: center;
	justify-content: flex-end;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
	background-color: var(--main-color);
}

.text {
	color: var(--bg-color);
	font-size: 0.9em;
}

.badge {
	width: 2.5em;
	transform: translate(0.5em);
}

.badge-sml {
	width: 1.5em;
}
</style>
