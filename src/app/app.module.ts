import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchModule } from './search/search.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalcComponent } from './calc/calc.component';
import { CalcModule } from './calc/calc.module';
import { PokemonCardComponent } from './pokemon-card/pokemon-card.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CalcModule,
    AppRoutingModule, 
    SearchModule,
    MatTabsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
