import { useState, useEffect, useRef, useCallback } from "react";
import APIService from "../services/APIService"; // adjust path as needed

const useProducts = (categoryName = "ALL") => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const requestId = useRef(0); // track latest request to ignore stale responses

  // fetchProducts function is stable and safe to use in useEffect
  const fetchProducts = useCallback(async (category) => {
    const currentRequest = ++requestId.current; // increment request ID
    setLoading(true);

    if (category === "Home") {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const res = await APIService().fetchProducts(category);

      // Only update state if this request is the latest
      if (currentRequest === requestId.current) {
        if (res.success) {
          setProducts(res.products || []);
          setStatusMessage("Fetched Successfully");
        } else {
          setStatusMessage(res.error || "Failed to fetch products");
        }
      }
    } catch (err) {
      if (currentRequest === requestId.current) {
        console.error(err);
        setStatusMessage("Error fetching products");
      }
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
        setTimeout(() => setStatusMessage(""), 5000);
      }
    }
  }, []);

  // Run fetch whenever categoryName changes
  useEffect(() => {
    fetchProducts(categoryName);
  }, [categoryName]);

  return { products, loading, statusMessage };
};

export default useProducts;
