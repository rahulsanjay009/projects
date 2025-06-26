import { useEffect, useState, useRef, useCallback } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from "react-router-dom";
import { FaWhatsapp as WhatsApp} from 'react-icons/fa';
import SideBar from "./SideBar";
import AddRemoveProduct from "./AddRemoveProduct";
import { useLocation } from "react-router-dom";

const BATCH_SIZE = 15;

const preloadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = resolve;
  });

const ProductCatalog = ({ products = [], relatedProducts = [] }) => {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [nextIndex, setNextIndex] = useState(0);
  const [loadingBatch, setLoadingBatch] = useState(false);
  const productIds = useRef(new Set());

  const navigate = useNavigate();
  const location = useLocation();

  const loadNextBatch = useCallback(async () => {
    if (nextIndex >= products.length) return;

    setLoadingBatch(true);
    const nextBatch = products.slice(nextIndex, nextIndex + BATCH_SIZE);
    const newProducts = [];

    for (let product of nextBatch) {
      if (!productIds.current.has(product.id)) {
        newProducts.push(product);
        productIds.current.add(product.id);
      }
    }

    const imageUrls = newProducts
      .filter((p) => p.image_url)
      .map((p) => `${encodeURI(p.image_url)}?f_auto,q_auto,w_600`);
    await Promise.all(imageUrls.map(preloadImage));

    setVisibleProducts((prev) => [...prev, ...newProducts]);
    setNextIndex((prev) => prev + BATCH_SIZE);
    setLoadingBatch(false);
  }, [nextIndex, products]);

  useEffect(() => {
    setVisibleProducts([]);
    setNextIndex(0);
    productIds.current.clear();
  }, [products]);
 
  useEffect(() => {
    if (!loadingBatch && nextIndex < products.length) {
      loadNextBatch();
    }
  }, [loadingBatch, nextIndex, products.length, loadNextBatch]);

  return (
    <Box display="flex">
      
      <SideBar />
      {/* Product Grid */}
      <Box
        sx={{
          width:'100%',
          px: 1,
          "&::-webkit-scrollbar": {
            width: "6px", // set desired width
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#4caf50", // thumb color
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1", // track color
          },
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2, // gap between cards
          justifyContent: 'center', // center cards if fewer than 3
          m: 1,
          p:1
        }}
      >
          {visibleProducts.map((product) => (
            <Box key={product.id} sx={{ width: 275, flex: '0 0 auto' }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: 3,
                  background: "linear-gradient(to bottom, #ffffff, #f9f9f9)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardActionArea
                  onClick={() => {
                    navigate(`/product`, {
                      state: {
                        product,
                        relatedProducts: relatedProducts,
                      },
                    });
                  }}
                  disableRipple
                  sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
                >
                  {product.image_url ? (
                    <Box sx={{ overflow: "hidden", height: 250 }}>
                      <CardMedia
                        component="img"
                        loading="lazy"
                        image={`${encodeURI(product.image_url)}?f_auto,q_auto,w_600`}
                        alt={product.name}
                        sx={{
                          height: 250,
                          width: "100%",
                          objectFit: "contain",
                          transition: "transform 0.3s",
                          "&:hover": {
                            transform: "scale(1.2)",
                          },
                        }}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        height: 250,
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography color="#999">No Image</Typography>
                    </Box>
                  )}
                  <CardContent sx={{ width: "100%" }}>
                    <Typography variant="h6" sx={{ textWrap: "wrap", wordBreak: "break-word" }}>
                      {product.name}
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography> */}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        my: 1,
                      }}>
                        {product?.categories.map((category) => (
                          <Box boxShadow={1} borderRadius={3} fontSize={10} bgcolor="#EEEEEE" p={0.5} key={category.id}>
                            {category.name}
                          </Box>
                        ))}
                      </Box>
                  
                    <Typography variant="subtitle4">
                      {product.price == 0 ? "$Contact for price" : `$${product.price}`}
                    </Typography>
                    <Box display={"flex"} justifyContent={"space-between"} mt={1}>                      
                        <Box width='50%'><AddRemoveProduct productId={product.id}/></Box>
                        <IconButton
                          component="a"
                          href={`https://wa.me/16692688087?text=${encodeURIComponent(
                            `Hi, I'm interested in this product:\n\n${product.name}\nPrice: ${
                              product.price == 0 ? "Contact for price" : `$${product.price}`
                            }\n\nImage: ${encodeURI(product.image_url)}?f_auto,q_auto,w_600\n\nIs this available?`
                          )}`}
                          target="_blank"
                          color="inherit"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <WhatsApp />
                        </IconButton>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>

          ))}   
          {loadingBatch && (
            <Box component={'div'} width={'350px'} alignSelf={'center'} textAlign={'center'}>
              <CircularProgress />
            </Box>
          )}       
        </Box>

      </Box>
  );
};

export default ProductCatalog;
