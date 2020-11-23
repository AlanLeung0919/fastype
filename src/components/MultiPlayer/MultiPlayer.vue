<template>
	<div class="multiplayer">
		<Lobby v-if="!inRoom" @connect="connect" />
		<Game
			v-else
			:rank="rank"
			:players="players"
			:waiting="waiting"
			:countdown="countdown"
			:startTime="startTime"
			:propRawText="rawText"
			@leave="leaveRoom()"
			@gameUpdate="gameUpdate"
			@start="countdown = false"
			@playerFinish="playerFinish"
		/>
	</div>
</template>

<script>
import Game from './Game';
import Lobby from './Lobby';
import io from 'socket.io-client';

export default {
	components: {
		Game,
		Lobby
	},
	data() {
		return {
			rank: 0,
			startTime: 0,
			waiting: true,
			inRoom: false,
			countdown: false,
			players: [],
			rawText: []
		};
	},
	methods: {
		initSocket() {
			const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
			const token = googleUser.getAuthResponse().id_token;
			this.socket = io(process.env.VUE_APP_BASEURL, {
				query: { token: token }
			});
		},
		connect(obj) {
			if (obj.type === 'private')
				this.socket.emit('joinPrivate', { roomId: obj.roomId });
			else if (obj.type === 'public') this.socket.emit('joinPublic');
			else this.socket.emit('createRoom');
		},
		gameUpdate(obj) {
			this.socket.emit('gameUpdate', obj);
		},
		playerFinish() {
			this.socket.emit('playerFinish');
		},
		leaveRoom() {
			this.socket.emit('leaveRoom');
			this.inRoom = false;
			this.rank = 0;
			this.waiting = true;
			this.countdown = false;
			this.players = [];
			this.rawText = [];
		}
	},
	created() {
		this.initSocket();
		this.socket.on('connect_error', (err) => {
			this.$store.commit('setAlert', err);
			this.$router.push('/');
		});
		this.socket.on('joinRoom', (text) => {
			this.inRoom = true;
			this.rawText = text;
		});
		this.socket.on('countdown', (time) => {
			this.waiting = false;
			this.countdown = true;
			this.startTime = time;
		});
		this.socket.on('playerUpdate', (players) => {
			const selfIdx = players.findIndex(
				(e) => e.email === this.$store.state.user.email
			);
			const self = players[selfIdx];
			players.splice(selfIdx, 1);
			players.unshift(self);
			this.players = players;
			if (this.players[0].rank) this.rank = this.players[0].rank;
		});
	},
	beforeDestroy() {
		this.socket.disconnect();
	}
};
</script>

<style scoped>
.multiplayer {
	width: 80%;
	height: 100%;
	display: flex;
	margin-left: auto;
	margin-right: auto;
	align-items: center;
	justify-content: center;
}
</style>
