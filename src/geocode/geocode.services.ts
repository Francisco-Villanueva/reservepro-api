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

      const result = response.data.results[0];
      const location = result.geometry.location;

      // Encontrar el componente de dirección que representa la ciudad
      let city = '';
      for (const component of result.address_components) {
        if (component.types.includes('locality')) {
          city = component.long_name;
          break;
        }
      }

      return {
        lat: location.lat,
        lng: location.lng,
        city,
      };
    } catch (error) {
      throw new Error('Error en la geocodificación: ' + error.message);
    }
  }
}
