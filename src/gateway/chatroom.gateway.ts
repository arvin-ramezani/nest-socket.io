import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  userJoinRoom,
  getCurrentUserById,
  userLeave,
  getRoomUsers,
} from 'src/utils/users';
import { formatMessage } from '../utils/messages';

// @WebSocketGateway(3001, { namespace: 'chatroom' })
@WebSocketGateway()
export class ChatroomGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  wsServer: Server;

  botName = 'ChatCord Bot';

  //This Method Runs When Any User Connected
  handleConnection(client: Socket, ...args: any[]) {
    client.emit(
      'message',
      formatMessage(this.botName, 'Welcome To ChatCord !'),
    );
  }

  handleDisconnect(client: Socket) {
    const user = userLeave(client.id);

    if (user) {
      this.wsServer
        .to(user.room)
        .emit(
          'message',
          formatMessage(this.botName, `${user.username} has left the chat`),
        );

      // Send Users And Room Info
      this.wsServer.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  }

  // Listen For chatMessage
  @SubscribeMessage('chatMessage')
  handleMessage(client: Socket, data: string): void {
    // Find Sender Person
    const user = getCurrentUserById(client.id);
    console.log(user, data);
    this.wsServer
      .to(user.room)
      .emit('message', formatMessage(user.username, data));
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    client: Socket,
    { username, room }: { username: string; room: string },
  ): void {
    const user = userJoinRoom(client.id, username, room);
    // Join User To Room
    client.join(user.room);

    client.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(this.botName, `${username} has joined the chat`),
      );

    // Send Users And Room Info
    this.wsServer.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  }
}
