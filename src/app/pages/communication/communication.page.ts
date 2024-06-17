import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.page.html',
  styleUrls: ['./communication.page.scss'],
})
export class CommunicationPage implements OnInit, AfterViewInit, OnDestroy {
  private map!: mapboxgl.Map;
  private track: { lat: number; lon: number }[] = [];
  private routeData: any = { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } };
  private updateInterval: any; // Define update interval variable
  isTracking: boolean = false; // Adding isTracking property
  private routeLayerId = 'route';

  ngOnInit() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia3V5YWtlbiIsImEiOiJjbHJmM2dyOTEwMTA2MmpwbnFobnMyNXBwIn0.JMwE-R1YaXBSQNvTYSg4Iw';
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  canEnableTracking = false;

  initializeMap() {
    if (!mapboxgl.supported()) {
      console.log('Mapbox GL is not supported by this browser.');
      return;
    }

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
      center: [0, 0],
      zoom: 2,
    });

    this.map.on('load', () => {
      this.canEnableTracking = true;
      this.map.resize();
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        const newPoint: mapboxgl.LngLatLike = [longitude, latitude];
        this.track.push({ lat: latitude, lon: longitude });

        if (this.track.length === 1) {
          this.map.setCenter(newPoint);
          this.map.setZoom(18);
        }

        new mapboxgl.Marker().setLngLat(newPoint).addTo(this.map);
      }, (error: GeolocationPositionError) => {
        console.error('Geolocation error:', error);
      }, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000
      });
    });
  }

  startTracking() {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by this browser.');
      return;
    }

    this.isTracking = true; // Update isTracking to true when tracking starts
    navigator.geolocation.watchPosition((position)=>{
      console.log(position);

    })
    this.updateInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        const newPoint: mapboxgl.LngLatLike = [longitude, latitude];
        this.track.push({ lat: latitude, lon: longitude });

        if (this.track.length === 1) {
          this.map.setCenter(newPoint);
          this.map.setZoom(18);
        }

        new mapboxgl.Marker().setLngLat(newPoint).addTo(this.map);

        console.log(`Point added: Lat: ${latitude}, Lon: ${longitude}`);

        // Update the route path
        this.routeData.geometry.coordinates.push(newPoint);
        this.updateRouteLayer();

      }, (error: GeolocationPositionError) => {
        console.error('Geolocation error:', error);
      }, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000
      });
    }, 1000); // Update every 1 second

    // Add the route source and layer
    this.map.addSource('route', {
      'type': 'geojson',
      'data': this.routeData,
    });

    this.map.addLayer({
      'id': this.routeLayerId,
      'type': 'line',
      'source': 'route',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#888',
        'line-width': 8
      }
    });
  }

  stopTracking() {
    this.isTracking = false; // Update isTracking to false when tracking stops

    clearInterval(this.updateInterval); // Clear the update interval
    this.downloadGPX();

    // Remove existing route layer and source
    if (this.map.getLayer(this.routeLayerId)) {
      this.map.removeLayer(this.routeLayerId);
      this.map.removeSource('route');
    }
  }

  updateRouteLayer() {
    // Remove existing route layer and source
    if (this.map.getLayer(this.routeLayerId)) {
      this.map.removeLayer(this.routeLayerId);
      this.map.removeSource('route');
    }

    // Add the updated route source and layer
    this.map.addSource('route', {
      'type': 'geojson',
      'data': this.routeData,
    });

    this.map.addLayer({
      'id': this.routeLayerId,
      'type': 'line',
      'source': 'route',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#888',
        'line-width': 8
      }
    });
  }

  downloadGPX() {
    let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="GPS Tracker - https://yourwebsite.com">
  <trk>
    <name>Your Track Name</name>
    <trkseg>`;

    this.track.forEach(point => {
      gpxContent += `
      <trkpt lat="${point.lat}" lon="${point.lon}"></trkpt>`;
    });

    gpxContent += `
    </trkseg>
  </trk>
</gpx>`;

    const blob = new Blob([gpxContent], { type: "application/gpx+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'track.gpx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
