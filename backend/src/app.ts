import { appRoutes } from './presentation/routes';
import { Server } from './presentation/server';

(async () => {
  main();
})();

function main() {
  const server = new Server({
    port: process.env.PORT ?? 3000,
    routes: appRoutes(),
  });

  server.start();
}
