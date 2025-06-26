import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import APIService from "../../services/APIService";
import CartPage from "./CartPage"; // The presentational UI component
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';


const Cart = () => {
  const cartItems = useSelector((state) => state.CartReducer?.products || []);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const productIds = cartItems.map((p) => p.product_id);
        if (productIds.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const res = await APIService().fetchCartProducts(productIds);

        if (res?.success) {
          const enrichedProducts = res.products.map((product) => {
            const matched = cartItems.find((p) => p.product_id === product.id);
            return matched ? { ...product, quantity: matched.quantity } : product;
          });
          setProducts(enrichedProducts);
        } else {
          console.error("Failed to fetch cart products", res.message);
        }
      } catch (err) {
        console.error("Error fetching cart products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartDetails();
  }, [cartItems]);

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6">Your cart is empty.</Typography>
      </Box>
    );
  }

  return <CartPage cartItems={products} />;
};

export default Cart;
