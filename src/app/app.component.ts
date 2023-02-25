import { AfterViewInit, Component, OnInit } from '@angular/core';
import { itemDB, movesDB, NamesDB, NATURES_EN, PokemonDBE, typingDB } from 'src/assets/bin/pokemonDBE';
import { Gender, PokemonData, StatModel } from './calc/calc.component';
import { EVS, IVS, Pokemon, PokemonDB } from './constant';
import { ParseBinService } from './services/parse-bin.service';
import { ParseSavService } from './services/parse-sav.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'adelay-nuzlocke-calc';

  saveFile: File;



  pkmList: Pokemon[];
  pkmCalcList: PokemonData[];

  constructor(
    protected parseSavService: ParseSavService,
    private parseBinService: ParseBinService
    ) { }
  
  ngOnInit() : void {
    // fetch('./assets/bin/personal_e').then(response => {
    //   return response.blob();
    // }).then((blob) => {
    //   const fileReader = new FileReader();
    //   fileReader.onload = e => {
    //     const saveFile: ArrayBuffer = fileReader.result as ArrayBuffer;
    //     const byteArray: number[]= Array.from(new Uint8Array(saveFile)).map(i => parseInt(i.toString(16), 16));
    //     this.parseBinService.setUpData(byteArray)
    //   }
    //   fileReader.readAsArrayBuffer(blob);
    // })

    window.addEventListener('dragover', (e) => {
      e.preventDefault();
    })
    
    window.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const fileInput = e.dataTransfer.files[0]
      this.parseSave(fileInput);
    })
  }

  parseSave(file) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const saveFile: ArrayBuffer = fileReader.result as ArrayBuffer;
      const byteArray: number[]= Array.from(new Uint8Array(saveFile)).map(i => parseInt(i.toString(16), 16));
      this.pkmList = this.parseSavService.parseSav(byteArray);
      this.pkmCalcList = this.getReadableData(this.pkmList);
      console.log(this.pkmCalcList);
    }
    fileReader.readAsArrayBuffer(file);
  }


  getReadableData(pkmList: Pokemon[]) : PokemonData[]  {
    return pkmList.map(pkmDB => {
      return {
        attacks: [
          {
            name: movesDB[pkmDB.moves.move1]
          },{
            name: movesDB[pkmDB.moves.move2]
          },{
            name: movesDB[pkmDB.moves.move3]
          },{
            name: movesDB[pkmDB.moves.move4]
          }
        ],
        gender: pkmDB.gender == 1 ? Gender.Masculine : (pkmDB.gender === 2 ? Gender.Undefined : Gender.Femenine),
        item: itemDB[pkmDB.heldItem],
        level: pkmDB.pokemonLevel,
        nature: pkmDB.nature,
        urlSprite: `https://www.pokencyclopedia.info/sprites/gen3/ani_emerald/ani_e_${pkmDB.idSpecies}.gif`,
        stats: this.getPokemonStats(PokemonDBE[pkmDB.idSpecies].pokemonDB, pkmDB.ivs, pkmDB.evs, pkmDB.pokemonLevel, this.getIncreasingStatNature(pkmDB.nature), this.getDecreasingStatNature(pkmDB.nature)),
        ivs: pkmDB.ivs,
        type1: typingDB[PokemonDBE[pkmDB.idSpecies].pokemonDB.types[0]],
        type2: typingDB[PokemonDBE[pkmDB.idSpecies].pokemonDB.types[1]],
        species: NamesDB[pkmDB.idSpecies]
      }
    })
  }

  getPokemonStats(pokemonDB: PokemonDB, ivs: IVS, evs: EVS, pokemonLevel: number, increasingStat: string, decreasingStat: string) : StatModel {
    let HP: number = this.statFormula(pokemonDB.HP, ivs.HP, evs.HP, pokemonLevel, 'HP', increasingStat, decreasingStat);
    let ATK: number = this.statFormula(pokemonDB.ATK, ivs.ATK, evs.ATK, pokemonLevel, 'ATK', increasingStat, decreasingStat);
    let DEF: number = this.statFormula(pokemonDB.DEF, ivs.DEF, evs.DEF, pokemonLevel, 'DEF', increasingStat, decreasingStat);
    let SPA: number = this.statFormula(pokemonDB.SPA, ivs.SPA, evs.SPA, pokemonLevel, 'SPA', increasingStat, decreasingStat);
    let SPD: number = this.statFormula(pokemonDB.SPD, ivs.SPD, evs.SPD, pokemonLevel, 'SPD', increasingStat, decreasingStat);
    let SPE: number = this.statFormula(pokemonDB.SPE, ivs.SPE, evs.SPE, pokemonLevel, 'SPE', increasingStat, decreasingStat);
    return {
      HP,
      ATK,
      DEF,
      SPA,
      SPD,
      SPE
    }
  }

  statFormula(base: number, iv: number, ev: number, level: number, stat: string, increasingStat: string, decreasingStat: string) {
    if (stat === 'HP')
      return Math.floor((((((2 * base) + iv + (ev/4)) * level) / 100) + level + 10));
    let natureMultiplier = 1;
    if (stat === increasingStat)
      natureMultiplier = 1.1;
    else if (stat === decreasingStat)
      natureMultiplier = 0.9;
    return Math.floor((Math.floor(((((2 * base) + iv + (ev/4)) * level) / 100)) + 5) * natureMultiplier);
  }

  getIncreasingStatNature(nature: string) {
    let increasingStat: string = '';
    switch (nature){
      case 'Adamant':
      case 'Lonely':
      case 'Naughty':
      case 'Brave':
        increasingStat = 'ATK';
        break;
      case 'Bold':
      case 'Impish':
      case 'Lax':
      case 'Relaxed':
        increasingStat = 'DEF';
        break;
      case 'Modest':
      case 'Mild':
      case 'Rash':
      case 'Quiet':
        increasingStat = 'SPA';
        break;
      case 'Calm':
      case 'Gentle':
      case 'Careful':
      case 'Sassy':
        increasingStat = 'SPD';
        break;
      case 'Timid':
      case 'Hasty':
      case 'Jolly':
      case 'Naive':
        increasingStat = 'SPE';
        break;
      default:
        increasingStat = '';
        break;
      }
      
      return increasingStat;

    }

  getDecreasingStatNature(nature: string) {
    let decreasingStat: string = '';
    switch (nature){
      case 'Bold':
      case 'Modest':
      case 'Calm':
      case 'Timid':
        decreasingStat = 'ATK';
        break;
      case 'Lonely':
      case 'Mild':
      case 'Gentle':
      case 'Hasty':
        decreasingStat = 'DEF';
        break;
      case 'Adamant':
      case 'Impish':
      case 'Careful':
      case 'Jolly':
        decreasingStat = 'SPA';
        break;
      case 'Naughty':
      case 'Lax':
      case 'Rash':
      case 'Naive':
        decreasingStat = 'SPD';
        break;
      case 'Brave':
      case 'Relaxed':
      case 'Quiet':
      case 'Sassy':
        decreasingStat = 'SPE';
        break;
      default:
        decreasingStat = '';
        break;
      }
      
      return decreasingStat;

    }

}
