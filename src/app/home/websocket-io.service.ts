import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as socket from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketIoService {
  /**
   * @ignore
   */
  private clientSocket: socket.Socket;

  constructor() {
    this.clientSocket = socket.io(environment.apiUrl + "/", { transports: ['websocket'] });
  }

  listenToServer(connectionType): Observable<any> {
    return new Observable((subscribe) => {
      this.clientSocket.on(connectionType, (data) => {
        subscribe.next(data);
      })
    });
  }

}
