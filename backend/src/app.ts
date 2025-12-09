import { appRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { startCronJobs } from './shared/cron';

(async () => {
  main();
})();

function main() {
  const server = new Server({
    port: process.env.PORT ?? 3000,
    routes: appRoutes(),
  });

  server.start();
  
  startCronJobs();
}
