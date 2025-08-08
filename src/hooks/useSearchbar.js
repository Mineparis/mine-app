import { useState, useRef, useEffect } from 'react';

export function useSearchbar(searchToggle) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const searchTimeout = useRef();

  useEffect(() => {
    if (!searchToggle) {
      setSearchTerm("");
      setSearchResults([]);
      setIsSearchLoading(false);
      return;
    }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearchLoading(false);
      return;
    }
    setIsSearchLoading(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search-products?keyword=${encodeURIComponent(searchTerm)}&limit=8`);
        const data = await res.json();
        setSearchResults(data.products || []);
      } catch (e) {
        setSearchResults([]);
      } finally {
        setIsSearchLoading(false);
      }
    }, 350);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchTerm, searchToggle]);

  useEffect(() => {
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearchLoading,
  };
}
