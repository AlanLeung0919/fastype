<template>
	<div class="typing">
		<SinglePlayer />
	</div>
</template>

<script>
import SinglePlayer from '@/components/SinglePlayer/SinglePlayer';

export default {
	components: {
		SinglePlayer
	}
};
</script>

<style scoped>
.typing {
	width: 80%;
	margin-left: auto;
	margin-right: auto;
}
</style>
