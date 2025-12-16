import { PORT } from './config/env.config';
import { appRoutes } from './presentation/routes';
import { Server } from './presentation/server';
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
