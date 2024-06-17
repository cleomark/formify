// geolocate.component.ts
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-geolocate',
  templateUrl: './geolocate.component.html',
  styleUrls: ['./geolocate.component.scss'],
})
export class GeolocateComponent implements OnInit, AfterViewInit, OnDestroy {
  private map!: mapboxgl.Map;

  ngOnInit() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia3V5YWtlbiIsImEiOiJjbHJmM2dyOTEwMTA2MmpwbnFobnMyNXBwIn0.JMwE-R1YaXBSQNvTYSg4Iw';
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  ngOnDestroy() {
    // Cleanup map and related resources
    if (this.map) {
      this.map.remove();
    }
  }

  initializeMap() {
    if (!this.map) {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        zoom: 10,
      });

      this.map.on('load', () => {
        const geolocate = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        });

        geolocate.on('geolocate', (event: any) => {
          const { longitude, latitude } = event.coords;
          const timestamp = new Date().toLocaleTimeString();

          console.log(`[${timestamp}] Latitude: ${latitude}, Longitude: ${longitude}`);

          this.map.setCenter([longitude, latitude]);
          this.reverseGeocode(longitude, latitude);
        });

        this.map.addControl(geolocate);
        geolocate.trigger();
      });
    }
  }

  reverseGeocode(longitude: number, latitude: number): void {
    const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const location = data.features[0].place_name;
        const timestamp = new Date().toLocaleTimeString();

        console.log(`[${timestamp}] Current Location: ${location}`);
      })
      .catch((error) => {
        console.error('Error fetching location:', error);
      });
  }
}
