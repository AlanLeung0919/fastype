<template>
	<div class="wrapper">
		<div class="badge-sml">
			<img :src="getBadge(level - 1)" />
		</div>
		<div class="level">
			<div class="progress" :style="getWidth()">
				<div class="text">lv.{{ level }}</div>
			</div>
			<div class="badge">
				<img :src="getBadge(level)" />
			</div>
		</div>
		<div class="badge-sml">
			<img :src="getBadge(level + 1)" />
		</div>
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

.level {
	width: 90%;
	height: 1em;
	display: flex;
	border-radius: 5px;
	align-self: center;
	position: relative;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.1);
}

.progress {
	height: 1em;
	display: flex;
	min-width: 50px;
	align-items: center;
	justify-content: center;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
	background-color: var(--main-color);
}

.text {
	color: var(--bg-color);
	white-space: nowrap;
	font-size: 0.75em;
}

.badge {
	width: 2.75em;
	height: 2.75em;
	transform: translate(-0.5em);
}

.badge-sml {
	width: 1.5em;
	height: 1.5em;
}
</style>
