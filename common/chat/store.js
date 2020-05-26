import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		SocketState: {},
		SocketStateErr: {},
		SocketMessage:{},
		SocketChatID:""
	},
	mutations: {
		setSocketState(that, info) {
			that.SocketState = info;
		},
		setSocketStateErr(that, info) {
			that.SocketStateErr = info;
		},
		setSocketMessage(that, info){
			that.SocketMessage = info;
		},
		setSocketSocketChatID(that, info){
			that.SocketChatID = info;
		}
	}
})
export default store;
