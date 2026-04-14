import express, { Router } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { FRONT_END_URL } from '@/config/env.config';

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
    this.app.use(
      cors({
        origin: FRONT_END_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    this.app.use(this.routes);

    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
