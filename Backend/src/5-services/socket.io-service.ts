import http from 'http';
import SocketIo from 'socket.io';

function init(httpServer: http.Server): void {
    const options = { cors: { origin: '*' } };
    const socketServer = new SocketIo.Server(httpServer, options);

    socketServer.sockets.on('connection', (socket: SocketIo.Socket) => {
        console.log('Socket: Client has been connected...');

        socket.on('followers-count', ({ vacationId, followersCount, isFollower }) => {
            isFollower ? followersCount++ : followersCount--;
            socketServer.emit('followers-count-updated', { vacationId, followersCount });
        });
    })
}

export default { init }