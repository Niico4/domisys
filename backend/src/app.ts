import { PORT } from './config/env.config';
import { appRoutes } from './api/v1/routes';
import { Server } from './api/v1/server';
import { startCronJobs } from './shared/cron';

(async () => {
  main();
})();

function main() {
  const server = new Server({
    port: PORT,
    routes: appRoutes(),
  });

  server.start();

  startCronJobs();
}
