import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { PokemonCardComponent } from './pokemon-card.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [PokemonCardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  exports: [PokemonCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PokemonCardModule { }
