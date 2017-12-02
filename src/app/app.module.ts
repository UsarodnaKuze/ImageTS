import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { DebuggerComponent } from './debugger/debugger.component';
import { GameComponent } from './game/game.component';
import { DrawerComponent } from './drawer/drawer.component';
import {GlobalService} from './global.service';
import { MainscreenComponent } from './mainscreen/mainscreen.component';
import {RouterModule, Routes} from '@angular/router';
import { CanvasPreviewComponent } from './canvas-preview/canvas-preview.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DebuggerComponent,
    GameComponent,
    DrawerComponent,
    MainscreenComponent,
    CanvasPreviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: '', component: DrawerComponent},
      {path: 'debugger', component: DebuggerComponent},
      {path: 'game', component: GameComponent},
    ])
  ],
  providers: [GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
