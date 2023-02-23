import { Component, OnInit } from '@angular/core';
import { PokemonData, Gender } from '../calc/calc.component';

@Component({
  selector: 'app-pokemon-card-reverse',
  templateUrl: './pokemon-card-reverse.component.html',
  styleUrls: ['./pokemon-card-reverse.component.scss']
})
export class PokemonCardReverseComponent implements OnInit {

  pokemon: PokemonData = {
    gender: Gender.Masculine,
    item: 'Sitrus Berry',
    level: 54,
    species: 'Dodrio',
    urlSprite: 'https://www.pokencyclopedia.info/sprites/gen3/ani_emerald/ani_e_085.gif',
    stats: {
      HP: 143,
      ATK: 140,
      DEF: 94,
      SPA: 86,
      SPD: 86,
      SPE: 138
    },
    attacks: [
      {
        name: 'Jump Kick'
      }
    ]
  };

  constructor() { }

  ngOnInit(): void {
  }

}
