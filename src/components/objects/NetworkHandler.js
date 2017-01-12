import io from 'socket.io-client'

import PlayerModel from 'src/components/models/PlayerModel';

const messages = {
    YOU_CONNECTED: 'you-connected',
    GAME_STARTED: 'game-started',
    PLAYERS: 'players',
}

class NetworkHandler {

    /**
     * NetworkHandler constructor
     */
    constructor() {
        this._url = 'http://localhost:3000';
        this._onPlayersChangedCallbacks = [];
        this._onConnectionCallbacks = [];

        this._players = [];
    }

    connect() {
        this._socket = io(this._url);

        this._socket.on(messages.YOU_CONNECTED, (payload) => {
            console.log('YOU_CONNECTED');

            for (const callback of this._onConnectionCallbacks) {
                callback(payload);
            }
        });

        this._socket.on(messages.GAME_STARTED, (payload) => {
            console.log('GAME STARTED!');
        });

        this._socket.on(messages.PLAYERS, this._onPlayersReceived.bind(this));
    }

    _onPlayersReceived(payload) {
        const players = new Map(payload);

        for (const player of players.values()) {
            this._players.push(new PlayerModel(player));
        }

        this._fireOnPlayersChanged();
    }

    _fireOnPlayersChanged() {
        for (const callback of this._onPlayersChangedCallbacks) {
            callback(this._players);
        }
    }

    addOnPlayersChangedListener(callback) {
        this._onPlayersChangedCallbacks.push(callback);
        this._fireOnPlayersChanged();
    }

    addOnConnectionListener(callback) {
        this._onConnectionCallbacks.push(callback);
    }
}

export default NetworkHandler;