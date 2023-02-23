import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { PokemonCardReverseComponent } from './pokemon-card-reverse.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [PokemonCardReverseComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  exports: [PokemonCardReverseComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PokemonCardReverseModule { }
