import { Injectable } from "@angular/core";
import { EMERALD_BIN_SIZE, PokemonDB, PokemonEntryDB } from "../constant";

@Injectable({
  providedIn: 'root'
})
export class ParseBinService {

  setUpData(data: number[]) {
    const splitData: number[][] =this.splitData(data, EMERALD_BIN_SIZE);
    let counter = -1;
    const pokemonDataList: PokemonEntryDB[] = [];
    splitData.forEach(x => {
      counter++;
      pokemonDataList.push({
        species: counter,
        pokemonDB: {
          HP: x[0x00],
          ATK: x[0x01],
          DEF: x[0x02],
          SPE: x[0x03],
          SPA: x[0x04],
          SPD: x[0x05],
          types: [x[0x06], x[0x07]],
          ability1: x[0x16],
          ability2: x[0x17],
          gender: x[0x10],
          expGrowth: x[0x13],
        }
      });
    });
    console.log(pokemonDataList);
  }

  private splitData(data: number[], binSize: number): number[][] {
    const result = [];
    for (let i = 0; i < data.length; i += binSize)
      result[i/binSize] = data.slice(i, i + binSize);
    return result;
  }

}
