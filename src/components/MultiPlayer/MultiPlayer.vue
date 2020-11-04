<template>
	<div class="multiplayer">
		<Lobby v-if="!inRoom" @connect="connect" />
		<Game v-else />
	</div>
</template>

<script>
import io from 'socket.io-client';
import Lobby from './Lobby.vue';
import Game from './Game.vue';
const socket = io(process.env.VUE_APP_BASEURL);

export default {
	components: {
		Lobby,
		Game
	},
	data() {
		return {
			inRoom: false
		};
	},
	methods: {
		connect(obj) {
			if (obj.type === 'private') {
				socket.emit('joinPrivate', { token: this.getToken(), roomId: obj.roomId});
			} else if (obj.type === 'public') {
				socket.emit('joinPublic', { token: this.getToken() });
			} else {
				socket.emit('createRoom', { token: this.getToken() });
			}
		},
		getToken() {
			const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
			const token = googleUser.getAuthResponse().id_token;
			return token;
		}
	},
	mounted() {
		socket.on('authFail', () => {
			this.$store.commit('setAlert', 'authentication failed');
			this.inRoom = false;
		});
	}
};
</script>

<style scoped>
.multiplayer {
	width: 75%;
	height: 100%;
	margin-left: auto;
	margin-right: auto;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
