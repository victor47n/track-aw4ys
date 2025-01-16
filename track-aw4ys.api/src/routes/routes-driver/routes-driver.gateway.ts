import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RoutesService } from '../routes.service';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

type PayloadProps = {
  routeId: string;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoutesDriverGateway {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(RoutesDriverGateway.name);

  constructor(private routesService: RoutesService) {}

  @SubscribeMessage('client:new-points')
  async handleMessage(client: any, payload: PayloadProps) {
    const { routeId } = payload;
    const route = await this.routesService.findOne(routeId);

    //@ts-expect-error = routes has not been difined
    const { steps } = route.directions.routes[0].legs[0];

    for (const step of steps) {
      const { lat, lng } = step.start_location;
      client.emit(`server:new-points/${routeId}:list`, {
        routeId,
        lat,
        lng,
      });

      client.broadcast.emit('server:new-points:list', {
        routeId,
        lat,
        lng,
      });

      await sleep(2000);

      const { lat: lat2, lng: lng2 } = step.end_location;
      client.emit(`server:new-points/${routeId}:list`, {
        routeId,
        lat: lat2,
        lng: lng2,
      });

      client.broadcast.emit('server:new-points:list', {
        routeId,
        lat: lat2,
        lng: lng2,
      });

      await sleep(2000);
    }
  }

  emitNewPoints(payload: { routeId: string; lat: number; lng: number }) {
    this.logger.log(
      `Emiting new points for route ${payload.routeId} - ${payload.lat}, ${payload.lng}`,
    );

    this.server.emit(`server:new-points/${payload.routeId}:list`, {
      routeId: payload.routeId,
      lat: payload.lat,
      lng: payload.lng,
    });

    this.server.emit('server:new-points:list', {
      routeId: payload.routeId,
      lat: payload.lat,
      lng: payload.lng,
    });
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
