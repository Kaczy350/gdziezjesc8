
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import RestaurantList from "../components/RestaurantList";

export default function Home() {
  const [results, setResults] = useState([]);

  const handleSearch = async (dish: string, city: string) => {
    const res = await fetch(`/api/search?dish=${dish}&city=${city}`);
    const data = await res.json();
    setResults(data.results || []);
  };

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Gdzie zjeść?</h1>
      <SearchBar onSearch={handleSearch} />
      <RestaurantList results={results} />
    </main>
  );
}
