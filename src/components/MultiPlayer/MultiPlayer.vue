<template>
	<div>

	</div>
</template>

<script>
import io from 'socket.io-client';

export default {
	mounted() {
		const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
		const token = googleUser.getAuthResponse().id_token;
		const socket = io(process.env.VUE_APP_BASEURL, { query: { token: token } });
		/* socket.on('connect', () => {
			const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
			const token = googleUser.getAuthResponse().id_token;
			socket.send(token);
		}); */
	}
};
</script>

<style scoped></style>
