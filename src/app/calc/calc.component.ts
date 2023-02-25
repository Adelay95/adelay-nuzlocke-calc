import { Component, Input, OnInit } from '@angular/core';
import { Pokemon } from '../constant';

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
  ivs?: StatModel,
  nature: string,
  type1: string,
  type2?: string,
  attacks: AttackModel[],
}

@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.scss']
})
export class CalcComponent implements OnInit {

  @Input()
  pkmList: Pokemon[];


  constructor() { }

  ngOnInit(): void {
  }

}
