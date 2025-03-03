import {EsImageDbEnum} from "../constants";

export type EsImageSource = {
  bildnummer: string;
  datum: string;
  suchtext: string;
  fotografen: string;
  hoehe: string;
  breite: string;
  db: EsImageDbEnum;
};

export type EsImage = {
  _index: string;
  _id: string;
  _score: number;
  _source: EsImageSource;
};
