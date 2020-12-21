<template>
	<div>
		<div v-if="!loading" class="multiplayer">
			<Lobby v-if="!inRoom" @connect="connect" :playerSize="playerSize" />
			<Game
				v-else
				:voteCount="voteCount"
				:rank="rank"
				:players="players"
				:waiting="waiting"
				:countdown="countdown"
				:startTime="startTime"
				:propRawText="rawText"
				:isPrivate="isPrivate"
				:roomId="roomId"
				@vote="vote"
				@leave="leaveRoom()"
				@gameUpdate="gameUpdate"
				@start="countdown = false"
				@playerFinish="playerFinish"
			/>
		</div>
		<div v-else class="loading">
			<font-awesome-icon class="fa-spin" icon="circle-notch" size="2x" />
		</div>
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
			playerSize: 0,
			voteCount: 0,
			startTime: 0,
			roomId: '',
			loading: true,
			waiting: true,
			inRoom: false,
			isPrivate: false,
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
		vote() {
			this.socket.emit('vote');
		},
		leaveRoom() {
			this.socket.emit('leaveRoom');
			this.inRoom = false;
			this.rank = 0;
			this.waiting = true;
			this.isPrivate = false;
			this.countdown = false;
			this.roomId = '';
			this.players = [];
			this.rawText = [];
			this.voteCount = 0;
		}
	},
	created() {
		this.initSocket();
		this.socket.on('connect', () => {
			this.loading = false;
		});
		this.socket.on('connect_error', (err) => {
			this.$store.commit('setAlert', err);
			this.$router.push('/');
		});
		this.socket.on('joinRoom', (text) => {
			this.inRoom = true;
			this.rawText = text;
		});
		this.socket.on('joinPrivateRoom', (data) => {
			this.inRoom = true;
			this.isPrivate = true;
			this.rawText = data.text;
			this.roomId = data.roomId;
		});
		this.socket.on('updateVote', (vote) => {
			this.voteCount = vote;
		});
		this.socket.on('roomError', () => {
			this.$store.commit('setAlert', 'room not found');
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
		this.socket.on('playerSize', (size) => {
			this.playerSize = size;
		});
	},
	beforeDestroy() {
		this.socket.disconnect();
	},
	computed: {
		authState() {
			return this.$store.state.authState;
		}
	},
	watch: {
		authState(val) {
			if (!val) {
				this.$store.commit('setAlert', 'you have been signed out');
				this.$router.push('/');
			}
		}
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

.loading {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
