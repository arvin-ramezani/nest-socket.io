import { ChatroomGateway } from './gateway/chatroom.gateway';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import moment from 'moment';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [],
  providers: [ChatroomGateway],
})
export class AppModule {}
