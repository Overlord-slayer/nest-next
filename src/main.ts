import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Configuración de la tubería global de validación
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true // Hace el casteo automatico en caso de recibir un valor diferente al que se le pasa
  }))
  // Configuración de CORS
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // Reemplaza esto con la URL de tu aplicación React
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Asegúrate de incluir OPTIONS
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }
  app.enableCors(corsOptions)

  // Puerto 8000
  await app.listen(8000)
}
bootstrap()
