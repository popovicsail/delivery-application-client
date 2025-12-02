import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";

export default function SearchControl({ onLocationSelected }) {
  const map = useMap();
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false, // ❌ ne koristi default marker
      showPopup: false,
      autoClose: false,  // ❌ ne zatvara search bar
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: "Unesi adresu...",
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result) => {
      const { x: lng, y: lat } = result.location;

      // ✅ centriraj mapu
      map.setView([lat, lng], 16);

      // ✅ ukloni prethodni marker ako postoji
      if (marker) {
        map.removeLayer(marker);
      }

      // ✅ dodaj novi marker
      const newMarker = L.marker([lat, lng]).addTo(map);
      setMarker(newMarker);

      // ✅ prosledi koordinate roditelju
      if (onLocationSelected) {
        onLocationSelected({ latitude: lat, longitude: lng });
      }
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, marker, onLocationSelected]);

  return null;
}
