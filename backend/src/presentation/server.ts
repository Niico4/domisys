import express, { Router } from 'express';

interface ServerOptions {
  port: number | string;
  routes: Router;
}

export class Server {
  private app = express();
  private readonly port: number | string;
  private readonly routes: Router;

  constructor(options: ServerOptions) {
    const { port, routes } = options;

    this.port = port;
    this.routes = routes;
  }

  public start(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(this.routes);

    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
