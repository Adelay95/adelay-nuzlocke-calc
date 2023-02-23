import { Component, OnInit } from '@angular/core';

export enum Gender {
  Masculine = '♂',
  Femenine = '♀',
  Undefined = ''
}

export interface StatModel {
  HP: number,
  ATK: number,
  DEF: number,
  SPA: number,
  SPD: number,
  SPE: number
}

export interface AttackModel {
  name: string
}

export interface PokemonData {
  species: string,
  gender: Gender,
  item: string,
  level: number,
  urlSprite: string,
  stats: StatModel,
  attacks: AttackModel[],
}

@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.scss']
})
export class CalcComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {
  }

}
