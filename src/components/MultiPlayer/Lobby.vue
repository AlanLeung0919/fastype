<template>
	<div class="lobby">
		<div class="wrapper">
			<font-awesome-icon icon="users" size="3x" />
			<div class="btn">join random room</div>
		</div>
		<div class="wrapper">
			<font-awesome-icon icon="network-wired" size="3x" />
			<div class="btn">join room by id</div>
		</div>
    <div class="wrapper">
			<font-awesome-icon icon="door-open" size="3x" />
			<div class="btn">create room</div>
		</div>
	</div>
</template>

<script>
export default {};
</script>

<style scoped>
.lobby {
	width: 75%;
	margin-left: auto;
	margin-right: auto;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 2.5em;
}

.wrapper {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2.5em 0 2.5em 0;
	gap: 2.5em;
}

.btn {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.5em 1.5em 0.5em 1.5em;
	color: var(--bg-color);
	background-color: var(--sub-color);
	cursor: pointer;
	border-radius: 5px;
	transition: 0.1s;
	white-space: nowrap;
}

.btn:hover {
	background-color: var(--main-color);
}
</style>
