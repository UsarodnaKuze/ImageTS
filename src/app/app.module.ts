import { FrameExtractorService } from './frame-extractor.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { DebuggerComponent } from './debugger/debugger.component';
import { GameComponent } from './game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    DebuggerComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
