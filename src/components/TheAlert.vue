<template>
	<div
		class="alert"
		@animationend="alert = false"
		:class="{ 'alert-anime': alert }"
	>
		{{ this.$store.state.alert }}
	</div>
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
			if (mutation.type !== 'setAlert') return;
			this.alert = false;
			setTimeout(() => {
				this.alert = true;
			}, 0);
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
	user-select: none;
	border-radius: 5px;
	white-space: nowrap;
	align-items: center;
	justify-content: center;
	padding: 10px 15px 10px 15px;
	color: var(--bg-color);
	transform: translate(-50%);
	background-color: var(--main-color);
}

.alert-anime {
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
