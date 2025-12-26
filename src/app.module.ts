import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FamilyModule } from './family/family.module';
import { UsersModule } from './users/users.module';
import { CatModule } from './cat/cat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DogsModule } from './dogs/dogs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 全局可用，其他模块可直接使用 ConfigService
      envFilePath: '.env', // 指定环境变量文件路径
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'FanLeZhi0514'),
        database: configService.get<string>('DB_DATABASE', 'nest_demo'),
        autoLoadEntities: true, // 不用手动引 Entity
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true), // 自动建表（生产一定关），仅限开发环境
      }),
      inject: [ConfigService],
    }),
    FamilyModule,
    UsersModule,
    CatModule,
    DogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
