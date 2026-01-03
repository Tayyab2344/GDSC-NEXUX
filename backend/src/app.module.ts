import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { FieldsModule } from './fields/fields.module';
import { FormsModule } from './forms/forms.module';
import { ClassesModule } from './classes/classes.module';
import { EventsModule } from './events/events.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatModule } from './chat/chat.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MailModule } from './mail/mail.module';
import { GalleryModule } from './gallery/gallery.module';
import { AlumniModule } from './alumni/alumni.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { EmailModule } from './email/email.module';
import { ResourcesModule } from './resources/resources.module';
import { ProjectsModule } from './projects/projects.module';
import { AiModule } from './ai/ai.module';
import { QuizModule } from './quiz/quiz.module';
import { ConfigService } from './admin/config.service';
import { ConfigController } from './admin/config.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TeamsModule,
    FieldsModule,
    FormsModule,
    ClassesModule,
    EventsModule,
    NotificationsModule,
    ChatModule,
    CloudinaryModule,
    MailModule,
    GalleryModule,
    AlumniModule,
    AnnouncementsModule,
    EmailModule,
    ResourcesModule,
    ProjectsModule,
    AiModule,
    QuizModule,
  ],
  controllers: [AppController, ConfigController],
  providers: [AppService, ConfigService],
})
export class AppModule { }
