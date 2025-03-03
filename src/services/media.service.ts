import dotenv from "dotenv";

import {EsImage, EsImageSource, SearchImageResponse} from "../types";
import {EsImageDbEnum, ImageDbEnum} from "../constants";

dotenv.config();

export class MediaService {
  private BASE_URL = process.env.BASE_MEDIA_URL;

  normalizeMedia(esImageSource: EsImageSource) {
    const media: SearchImageResponse = {
      id: +esImageSource.bildnummer,
      date: new Date(esImageSource.datum),
      height: +esImageSource.hoehe,
      width: +esImageSource.breite,
      text: esImageSource.suchtext,
      url: this.buildUrl(esImageSource),
    };

    return media;
  }

  private padMediaId(id: string): string {
    return id.padStart(10, "0");
  }

  buildUrl(mediaItem: EsImageSource, size: "s" | "m" | "l" = "s"): string {
    const paddedId = this.padMediaId(mediaItem.bildnummer);
    const mediaDb = mediaItem.db === EsImageDbEnum.STOCK ? ImageDbEnum.STOCK : ImageDbEnum.SPORT;

    return `${this.BASE_URL}/bild/${mediaDb}/${paddedId}/${size}.jpg`;
  }
}
