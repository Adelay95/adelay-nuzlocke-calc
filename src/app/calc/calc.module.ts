import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CalcComponent } from './calc.component';
import { PokemonCardModule } from '../pokemon-card/pokemon-card.module';
import { PokemonCardReverseModule } from '../pokemon-card-reverse/pokemon-card-reverse.module';

@NgModule({
  declarations: [CalcComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PokemonCardModule,
    PokemonCardReverseModule,
    MatAutocompleteModule
  ],
  exports: [CalcComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CalcModule { }
