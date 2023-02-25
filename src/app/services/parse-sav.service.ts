import { Injectable } from "@angular/core";
import { NATURES_EN, PokemonDBE } from "src/assets/bin/pokemonDBE";
import { EMERALD_BLOCK_POSITIO, EMERALD_BOX_SIZE, EMERALD_MAX_POK_BOX, EMERALD_SAVE_SIZE, EMERALD_SIZE_BOXLOT, EMERALD_SIZE_STORED, EVS, EXP_TABLE, G3_EN, ID_NATIONAL_DEX, IVS, Moves, Pokemon, PokemonEntryDB, SIZE_MAIN_EMERALD, SIZE_PARTY, SIZE_SECTOR_EMERALD, SIZE_SECTOR_USED_EMERALD } from "../constant";

@Injectable({
  providedIn: 'root'
})
export class ParseSavService {

pokemonDBE: PokemonEntryDB[] = PokemonDBE;

sector0: number = 0;

sector1: number = 0;

storage: number[] = Array(9 * SIZE_SECTOR_USED_EMERALD).fill(0);

large: number[] = Array(4 * SIZE_SECTOR_USED_EMERALD).fill(0);

small: number[] = Array(1 * SIZE_SECTOR_USED_EMERALD).fill(0);

pkmList: String[];

pokemonList : Pokemon[]= [];

  constructor(
  ) { }

  parseSav(byteArray: number[]): Pokemon[] {
    console.log(byteArray);
    const playerDataOffset = 0x2598;
    // reader.seek(playerDataOffset);
    if (byteArray.length === EMERALD_SAVE_SIZE) {
      console.log('FILE SIZE: CHECKED')
    }
    let slot = this.isSlot0Or1(byteArray);
    this.readSectors(slot, byteArray);
    let pokemonParty: Pokemon[] = this.initializePartyData();
    let pokemon: Pokemon[] = this.initializeBoxEdit();
    console.log(pokemon);
    return pokemon;
  }

  private isSlot0Or1(int16Array: number[]): number {
    
    let slot0 = this.isSlotValid(0, int16Array);
    let slot1 = this.isSlotValid(1, int16Array);
    if (slot0 && slot1)
      return this.sector1 > this.sector0 ? 1 : 0;
    else
      return slot0 ? 0 : (slot1 ? 1 : 0);
  } 

  private isSlotValid(slot, int16Array: number[]) {
    const start = SIZE_MAIN_EMERALD * slot;
    const end = start + SIZE_MAIN_EMERALD;
    let bitTrack = 0;
    for (let ofs = 0; ofs < end; ofs += SIZE_SECTOR_EMERALD) {
      const id = int16Array[ofs + 0xFF4];
      bitTrack |= (1 << id);
      if (id === 0 && slot === 0)
        this.sector0 = ofs;
      if (id === 0 && slot === 1)
        this.sector1 = ofs;
    }
    return bitTrack === 16383;

  }

  private readSectors(slot: number, byteArray: number[]) {
    const start: number = slot * SIZE_MAIN_EMERALD;
    const end: number = start + SIZE_MAIN_EMERALD;
    for (let ofs = start; ofs < end; ofs += SIZE_SECTOR_EMERALD) {
      const id = byteArray[ofs + 0xFF4];
      if (id >= 5) {
        for (let i = (id - 5) * SIZE_SECTOR_USED_EMERALD, j=0; i < (id - 4) * SIZE_SECTOR_USED_EMERALD; i++, j++) {
          this.storage[i] = byteArray[ofs + j];
        }
      } else if(id >= 1) {
        for (let i = (id - 1) * SIZE_SECTOR_USED_EMERALD, j=0; i < id * SIZE_SECTOR_USED_EMERALD; i++, j++) {
          this.large[i] = byteArray[ofs + j];
        }
      } else {
        for (let i = 0; i < SIZE_SECTOR_USED_EMERALD; i++) {
          this.small[i] = byteArray[ofs + i];
        }
      }
    }
  }

  private initializePartyData(): Pokemon[] {
    for (let slot = 0; slot < 6; slot++) {
      const offset = this.getPartyOffset(slot);
      const pokemon = this.getBoxSlot(offset, this.large);
      if (!pokemon)
        continue;
      const pokemonData: Pokemon = this.parsePokemon(pokemon);
      if (!pokemonData)
        continue;
      this.pokemonList.push(pokemonData);
    }
    return this.pokemonList;
  }

  private getPartyOffset(slot: number): number {
    return 0x238 + (SIZE_PARTY * slot);
  }

  private initializeBoxEdit(): Pokemon[] {
    let index = 0;
    for (let box = 1; box < EMERALD_BOX_SIZE; box++) {

      for (let slot = 0; slot < EMERALD_MAX_POK_BOX; slot++) {
        index = index + slot;
        let i = slot + index;
        let pokemon = this.getBoxSlotAtIndex(box, slot, this.storage);
        if (pokemon === undefined)
          continue;
        const pokemonData: Pokemon = this.parsePokemon(pokemon);
        if (!pokemonData)
          continue;
        this.pokemonList.push(pokemonData);
      }
    }
    return this.pokemonList;
  }

  private parsePokemon(pokemon: number[]): Pokemon {
    let experience = this.convertTo32Bit(pokemon, 0x24);
    let idSpecies = this.convertTo16Bit(pokemon, 0x20);
    idSpecies = ID_NATIONAL_DEX[idSpecies] ?? 0;
    if (idSpecies === 0)
      return undefined;
    let pokemonLevel = this.getPokemonLevel(experience, this.pokemonDBE[idSpecies].pokemonDB.expGrowth); //CAMBIAR AL EXP GROWTH
    let pokemonLevelEXP = this.getLevelEXP(pokemonLevel, this.pokemonDBE[idSpecies].pokemonDB.expGrowth);//CAMBIAR AL EXP GROWTH
    
    let nickname = this.getString(pokemon, 0x08, 10);

    let ivs: IVS = this.getPokemonIVs(pokemon);

    let evs: EVS = this.getPokemonEVs(pokemon);

    let moves: Moves = this.getPokemonMoves(pokemon);

    let heldItem: number = this.convertTo16Bit(pokemon, 0x22);

    let pid: number = this.convertTo32Bit(pokemon, 0x00);

    let gender: number = this.getPokemonGender(pid, this.pokemonDBE[idSpecies].pokemonDB.gender);

    let natureId: number = (pid % 25);

    let nature: string = NATURES_EN[natureId];

    
    const iv32 = this.convertTo32Bit(pokemon, 0x48);

    let abilityBit = iv32 >> 31 == 1;
    let ability = this.getAbility(abilityBit, idSpecies);

    let pokemonData: Pokemon = {
      experience, 
      idSpecies,
      pokemonLevel,
      pokemonLevelEXP,
      nickname,
      ivs,
      evs,
      moves,
      heldItem,
      gender,
      nature,
      ability
    }
    console.log(pokemonData);
    return pokemonData;
  }

  private getBoxSlotAtIndex(box: number, slot: number, int8Array: number[]) {
    return this.getBoxSlot(this.getBoxOffset(box) + (slot * EMERALD_SIZE_BOXLOT), int8Array);
  }

  private getBoxOffset(box: number) {
    return box + 4 + (EMERALD_SIZE_STORED * box * EMERALD_MAX_POK_BOX) - 1;
  }

  private getBoxSlot(offset: number, int8Array: number[]) {
    const pkmData = this.getData(int8Array, offset, EMERALD_SIZE_STORED);
    if (pkmData.filter(x => x === 0).length >= 68) {
      return undefined;
    }
    return this.getPKM(this.getDecryptedPKM(pkmData));
  }

  private getData(int8Array: number[], offset: number, sizeStored: number) : number[] {
    return int8Array.slice(offset, offset + sizeStored)
  }

  private getDecryptedPKM(pkmArray: number[]): number[] {
    if (pkmArray.length === 80 || pkmArray.length === 100) {
      const pid = this.convertTo32Bit(pkmArray, 0);
      const oid = this.convertTo32Bit(pkmArray, 4);
      const seed = (pid ^ oid) >>> 0;
      const xorkey: number[] = this.convertToBytes(seed);
      for (let i = 32; i < 80; i++) {
        pkmArray[i] = (pkmArray[i] ^ xorkey[i & 3]) >>> 0;
      }
      return this.shuffleArray3(pkmArray, pid % 24);
    }
  }

  convertTo32Bit(int8Array: number[], offset: number): number {
    const u32bytes = int8Array[offset + 3] * Math.pow(2, 24) +
    int8Array[offset + 2] * Math.pow(2, 16) +
    int8Array[offset + 1] * Math.pow(2, 8) +
    int8Array[offset] * Math.pow(2, 0);
    return u32bytes;
  }

  convertTo16Bit(int8Array: number[], offset: number): number {
    const u32bytes = int8Array[offset + 1] * Math.pow(2, 8) +
    int8Array[offset] * Math.pow(2, 0);
    return u32bytes;
  }

  convertToBytes(num: number): number[] {
    const arr = new Uint8Array([
      (num & 0xff000000) >> 24,
      (num & 0x00ff0000) >> 16,
      (num & 0x0000ff00) >> 8,
      (num & 0x000000ff)
    ]);
    const byteArray: number[]= Array.from(new Uint8Array(arr)).map(i => parseInt(i.toString(16), 16)).reverse();
    return byteArray;
  }

  shuffleArray3(pkmArray: number[], pid: number) : number[] {
    const sdata = [...pkmArray];
    const index: number = pid * 4;
    for (let block = 0; block < 4; block++) {
      let ofs = EMERALD_BLOCK_POSITIO[index + block];
      for (let i = 0; i < 12; i++) {
        sdata[32 + (12 * block) + i] = pkmArray[32 + (12 * ofs) + i];
      }
    } 

    if (pkmArray.length > EMERALD_SIZE_STORED){
      for (let i = EMERALD_SIZE_STORED; i < pkmArray.length; i++) {
        sdata[i] = pkmArray[i];
      }
    }
    return sdata;
  }

  getPKM(pkmArray: number[]) {
    return this.decryptParty(pkmArray)
  }

  decryptParty(pkmArray: number[]) {
    return this.decryptIfEncrypted(pkmArray);
  }

  decryptIfEncrypted(pkmArray: number[]) {
    const chk = this.getChk3(pkmArray);
    if (chk != this.convertTo16Bit(pkmArray, 0x1C))
      pkmArray = this.getDecryptedPKM(pkmArray);
    return pkmArray;
  }

  getChk3(pkmArray: number[]): number {
    let chk = 0;
    for (let i = 0x20; i < EMERALD_SIZE_STORED; i +=2) {
      chk += this.convertTo16Bit(pkmArray, i);
    }
    return chk % 65536;
  }

  getPokemonLevel(experience: number, expGrowth: number): number {
    if (experience >= EXP_TABLE[99][expGrowth]) {
      return 100;
    }
    let tl = 1;
    while (experience >= EXP_TABLE[tl][expGrowth])
      ++tl;
    return tl;
  }

  getLevelEXP(level: number, growth: number): number {
    if (level <= 1 || level >= 100)
      return 0;
    return EXP_TABLE[level - 1][growth];
  }

  getString(bytes: number[], offset:number, length: number) {
    let s = '';
    for (let i = 0; i < length; i++) {
      let val = bytes[offset + i];
      let c = G3_EN[val];
      if (c === '')
        break;
      s += c;
    }
    return s;
  }

  getPokemonIVs(data: number[]): IVS {
    const iv32 = this.convertTo32Bit(data, 0x48);
      let ivs: IVS ={
      HP : (iv32 >> 0x00) & 0x1F,
      ATK : (iv32 >> 0x05) & 0x1F,
      DEF : (iv32 >> 10) & 0x1F,
      SPE : (iv32 >> 15) & 0x1F,
      SPA : (iv32 >> 20) & 0x1F,
      SPD : (iv32 >> 25) & 0x1F
    }
    return ivs;
  }

  getPokemonEVs(data: number[]): EVS {
    let evs: EVS = {
      HP  : data[0x38],
      ATK : data[0x39],
      DEF : data[0x3A],
      SPE : data[0x3B],
      SPA : data[0x3C],
      SPD : data[0x3D]
    }
    return evs;
  }

  getPokemonMoves(data: number[]): Moves {
    let moves: Moves = {
      move1 : this.convertTo16Bit(data, 0x2C),
      move2 : this.convertTo16Bit(data, 0x2E),
      move3 : this.convertTo16Bit(data, 0x30),
      move4 : this.convertTo16Bit(data, 0x32)
    }
    return moves;
  }

  getAbility(second: boolean, idSpecies: number) {
    return second ? this.pokemonDBE[idSpecies].pokemonDB.ability1 : this.pokemonDBE[idSpecies].pokemonDB.ability2;
  }

  getPokemonGender(pid: number, gt: number) {
    if (gt === 255)
      return 2;
    if (gt === 254)
      return 1;
    if (gt === 0)
      return 0;
    return (pid & 0xFF) < gt ? 1 : 0;
  }
}
