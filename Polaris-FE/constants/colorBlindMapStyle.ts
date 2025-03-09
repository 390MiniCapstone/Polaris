export const colorBlindMapStyle = {
  deuteranopia: [
    {
      elementType: 'geometry',
      stylers: [{ color: '#ebe3cd' }],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#523735' }],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#f5f1e6' }],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#c9b2a6' }],
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#dcd2be' }],
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#ae9e90' }],
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry',
      stylers: [{ color: '#dfd2ae' }],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ color: '#dfd2ae' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#93817c' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [{ color: '#a5b076' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#447530' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#f5f1e6' }],
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [{ color: '#fdfcf8' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#f8c967' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#e9bc62' }],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry',
      stylers: [{ color: '#e98d58' }],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#db8555' }],
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#806b63' }],
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [{ color: '#dfd2ae' }],
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#8f7d77' }],
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#ebe3cd' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [{ color: '#dfd2ae' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{ color: '#b9d3c2' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#92998d' }],
    },
  ],

  tritanopia: [
    {
      featureType: 'all',
      elementType: 'geometry',
      stylers: [{ saturation: -100 }, { lightness: 10 }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ hue: '#D3D3D3' }, { saturation: -50 }, { lightness: 30 }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ hue: '#B0B0B0' }, { saturation: -40 }, { lightness: 20 }],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ hue: '#C5C5C5' }, { saturation: -100 }, { lightness: 50 }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ hue: '#0080FF' }, { saturation: 20 }, { lightness: -20 }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#444444' }],
    },
    {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#666666' }],
    },
  ],

  protanopia: [
    {
      featureType: 'all',
      elementType: 'geometry',
      stylers: [{ saturation: -100 }, { lightness: 10 }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ hue: '#E3E3E3' }, { saturation: -100 }, { lightness: 50 }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ hue: '#A0A0A0' }, { saturation: -50 }, { lightness: 20 }],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ hue: '#C1C1C1' }, { saturation: -100 }, { lightness: 40 }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ hue: '#0099FF' }, { saturation: 30 }, { lightness: -10 }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#333333' }],
    },
    {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#555555' }],
    },
  ],
};
