/**
 * Google Maps API Response Interfaces
 * 
 * Data-only interfaces that map directly from JSON responses.
 * Example for external service integration.
 */

export interface GeocodeResult {
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  place_id: string
  types: string[]
}

export interface GeocodeResponse {
  results: GeocodeResult[]
  status: string
}

export interface PlaceDetails {
  place_id: string
  name: string
  formatted_address: string
  formatted_phone_number?: string
  website?: string
  rating?: number
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
}

export interface PlaceDetailsResponse {
  result: PlaceDetails
  status: string
}
