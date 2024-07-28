// geocode.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeocodeService {
  private apiKey = process.env.GOOGLE_MAPS_APIKEY;

  async geocodeAddress(address: string) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address,
            key: this.apiKey,
          },
        },
      );

      if (response.data.status !== 'OK') {
        throw new Error(`Geocodificación fallida: ${response.data.status}`);
      }

      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } catch (error) {
      throw new Error('Error en la geocodificación: ' + error.message);
    }
  }
}
