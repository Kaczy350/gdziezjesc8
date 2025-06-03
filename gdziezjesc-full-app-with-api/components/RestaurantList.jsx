
import { useEffect, useState } from "react";
import { getDistanceFromLatLonInKm } from "../utils/distance";

export default function RestaurantList({ results }) {
  const [sortBy, setSortBy] = useState("rating");
  const [userLocation, setUserLocation] = useState(null);
  const [sortedResults, setSortedResults] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => {
        console.warn("Nie udało się pobrać lokalizacji");
      }
    );
  }, []);

  useEffect(() => {
    if (!results) return;

    const withDistance = results.map((res) => {
      let distance = null;
      if (userLocation && res.geometry?.location) {
        distance = getDistanceFromLatLonInKm(
          userLocation.lat,
          userLocation.lng,
          res.geometry.location.lat,
          res.geometry.location.lng
        );
      }
      return { ...res, distance };
    });

    const sorted = [...withDistance].sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "reviews") return (b.user_ratings_total || 0) - (a.user_ratings_total || 0);
      if (sortBy === "distance") return (a.distance || Infinity) - (b.distance || Infinity);
      return 0;
    });

    setSortedResults(sorted);
  }, [results, sortBy, userLocation]);

  return (
    <>
      <div className="mb-4">
        <label>Sortuj wg: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-1 border rounded">
          <option value="rating">Oceny</option>
          <option value="reviews">Liczby opinii</option>
          <option value="distance">Odległości</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedResults.map((res, idx) => (
          <div key={idx} className="p-4 border rounded">
            <h3 className="font-bold">{res.name}</h3>
            <p>{res.vicinity}</p>
            <p>Ocena: {res.rating || "brak"} ({res.user_ratings_total || 0} opinii)</p>
            {res.distance !== null && <p>{res.distance.toFixed(1)} km od Ciebie</p>}
          </div>
        ))}
      </div>
    </>
  );
}
