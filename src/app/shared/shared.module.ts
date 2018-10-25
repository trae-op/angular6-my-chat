import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatModule} from './mat/mat.module';
import {InterceptorModule} from './interceptor/interceptor.module';
import {SocketModule} from './socket/socket.module';

@NgModule({
  imports: [
    CommonModule,
    MatModule,
    InterceptorModule,
    SocketModule
  ],
  declarations: [],
  exports: [
    MatModule,
    SocketModule,
    InterceptorModule
  ]
})
export class SharedModule { }
