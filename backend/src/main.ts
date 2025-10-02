import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for the mobile app
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Benefits API is running on: http://localhost:${port}`);
  console.log(`📱 Available endpoints:`);
  console.log(`   GET /api/benefits - Get all benefits with filters`);
  console.log(`   GET /api/benefits/categories - Get all categories`);
  console.log(`   GET /api/benefits/:id - Get specific benefit`);
}

bootstrap();
