/* eslint-disable no-console */
import { server } from './app';
import config from './config';

async function bootstrap() {
  try {
    server.listen(config.port, () => {
      console.log(
        `Express Backend Setup Application listening on port ${config.port}`
      );
    });
  } catch (error) {
    console.error('Failed to connect', error);
  }
}

bootstrap();
