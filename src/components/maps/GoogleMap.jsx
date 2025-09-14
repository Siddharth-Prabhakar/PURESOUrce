import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GoogleMap = ({ samples, onMarkerClick, selectedRisk = 'all' }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeMap();
  }, []);

  useEffect(() => {
    if (map && samples) {
      updateMarkers();
    }
  }, [map, samples, selectedRisk]);

  const initializeMap = async () => {
    try {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places']
      });

      const google = await loader.load();
      
      const mapOptions = {
        center: { lat: 20.5937, lng: 78.9629 }, // Center of India
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
          }
        ]
      };

      const mapInstance = new google.maps.Map(mapRef.current, mapOptions);
      setMap(mapInstance);
      setIsLoading(false);

      // Auto-fit bounds if samples exist
      if (samples && samples.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        samples.forEach(sample => {
          if (sample.latitude && sample.longitude) {
            bounds.extend({ lat: sample.latitude, lng: sample.longitude });
          }
        });
        mapInstance.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      setIsLoading(false);
    }
  };

  const updateMarkers = () => {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    
    const filteredSamples = selectedRisk === 'all' 
      ? samples 
      : samples.filter(s => s.risk_classification === selectedRisk);

    const newMarkers = filteredSamples
      .filter(sample => sample.latitude && sample.longitude)
      .map(sample => {
        const marker = new google.maps.Marker({
          position: { lat: sample.latitude, lng: sample.longitude },
          map: map,
          title: sample.location_name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: getRiskColor(sample.risk_classification),
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: createInfoWindowContent(sample)
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
          if (onMarkerClick) {
            onMarkerClick(sample);
          }
        });

        return marker;
      });

    setMarkers(newMarkers);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'safe': return '#10B981';
      case 'moderate_risk': return '#F59E0B';
      case 'high_risk': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const createInfoWindowContent = (sample) => {
    const riskLabel = {
      'safe': 'Safe',
      'moderate_risk': 'Moderate Risk',
      'high_risk': 'High Risk'
    }[sample.risk_classification] || 'Unknown';

    return `
      <div style="padding: 12px; min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
          ${sample.location_name}
        </h3>
        <div style="margin-bottom: 8px;">
          <strong style="color: #374151;">HMPI Score:</strong> 
          <span style="color: #1f2937; font-weight: 600;">${sample.hmpi_score?.toFixed(1) || 'N/A'}</span>
        </div>
        <div style="margin-bottom: 8px;">
          <strong style="color: #374151;">Risk Level:</strong> 
          <span style="color: ${getRiskColor(sample.risk_classification)}; font-weight: 600;">
            ${riskLabel}
          </span>
        </div>
        <div style="margin-bottom: 8px;">
          <strong style="color: #374151;">Key Metals:</strong>
          <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
            ${sample.pb_mg_l ? `Pb: ${sample.pb_mg_l.toFixed(3)} mg/L` : ''}
            ${sample.as_mg_l ? ` • As: ${sample.as_mg_l.toFixed(3)} mg/L` : ''}
            ${sample.cd_mg_l ? ` • Cd: ${sample.cd_mg_l.toFixed(3)} mg/L` : ''}
          </div>
        </div>
        <div style="font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 6px; margin-top: 8px;">
          ${sample.latitude?.toFixed(4)}, ${sample.longitude?.toFixed(4)}
        </div>
      </div>
    `;
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="h-full w-full rounded-lg" />;
};

export default GoogleMap;