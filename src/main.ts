import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// 需要接入swagger,并生成swagger文档
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动删除 DTO 中未定义的字段
      forbidNonWhitelisted: true, // 直接报错
      transform: true, // 自动类型转换
    }),
  );

  // 全局响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());

  // swagger文档
  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('Nest API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 启动端口
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
