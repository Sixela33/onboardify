import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { corsOrigins } from './utils/constants';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('HTTP');

  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Log every request
  app.use((req, res, next) => {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    
    res.on('finish', () => {
      const { statusCode } = res;
      logger.log(
        `${method} ${originalUrl} ${statusCode} - ${userAgent} \n ${JSON.stringify(req.body)}`
      );
    });
    
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
