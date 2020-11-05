<template>
	<transition name="anime" @enter="reset()">
		<div v-if="alert" class="alert">
			{{ this.$store.state.alert }}
		</div>
	</transition>
</template>

<script>
export default {
	data() {
		return {
			alert: false
		};
	},
	methods: {
		reset() {
			setTimeout(() => {
				this.alert = false;
			}, 3000);
		}
	},
	created() {
		this.$store.subscribe((mutation, state) => {
			if (mutation.type === 'setAlert') this.alert = true;
		});
	}
};
</script>

<style scoped>
.alert {
	left: 50%;
	top: -50px;
	display: flex;
	position: fixed;
	min-height: 20px;
	min-width: 100px;
	border-radius: 5px;
	align-items: center;
	white-space: nowrap;
	color: var(--bg-color);
	justify-content: center;
	transform: translateX(-50%);
	padding: 10px 15px 10px 15px;
	background-color: var(--main-color);
	user-select: none;
}

.anime-enter-active {
	animation: enter 3s;
}

@keyframes enter {
	0% {
		top: -50px;
	}
	10% {
		top: 25px;
	}
	90% {
		top: 25px;
	}
	100% {
		top: -50px;
	}
}
</style>
