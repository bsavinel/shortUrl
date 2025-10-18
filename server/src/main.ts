import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const { PORT } = process.env;
const { CLIENT_ORIGIN } = process.env;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const port = PORT ?? 4000;
	const origins = [CLIENT_ORIGIN];

	app.enableCors({
		origin: origins,
		credentials: true,
	});
	
	await app.listen(port);
	app.useGlobalPipes(new ValidationPipe());
	console.log(
		`Server started on port ${port}. Allowing requests from ${origins.join()}`
	);
}
bootstrap();
