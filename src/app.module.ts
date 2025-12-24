import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FamilyModule } from './family/family.module';
import { UsersModule } from './users/users.module';
import { CatModule } from './cat/cat.module';

@Module({
  imports: [FamilyModule, UsersModule, CatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
