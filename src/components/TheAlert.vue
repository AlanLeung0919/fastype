<template>
	<transition name="anime">
		<div v-if="alert" class="alert" @animationend="alert = false">
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
	created() {
		this.$store.subscribe((mutation, state) => {
			if (!this.alert) this.alert = false;
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
}

.anime-enter-active {
	animation: enter 2.5s;
}

.anime-leave-active {
	animation: leave 0.5s;
}

@keyframes enter {
	0% {
		top: -50px;
	}
	20% {
		top: 25px;
	}
	100% {
		top: 25px;
	}
}

@keyframes leave {
	0% {
		top: 25px;
	}
	100% {
		top: -50px;
	}
}
</style>
