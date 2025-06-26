import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import Slider from "react-slick";
import { FaWhatsapp as WhatsApp} from 'react-icons/fa';
import AddRemoveProduct from "./AddRemoveProduct";

const DisplayProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product, relatedProducts } = location.state || {};

  const [randomRelatedProducts, setRandomRelatedProducts] = useState([]);

  const getRandomItems = (products) => {
    if (!products || products.length <= 10) return products || [];
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 10);
  };

  useEffect(() => {
    if (relatedProducts && product) {
      const filtered = relatedProducts.filter((p) => p.id !== product.id); // avoid showing current product
      setRandomRelatedProducts(getRandomItems(filtered));
    }
  }, [product, relatedProducts]);

  if (!product) {
    return (
      <Box display="flex">
        <SideBar />
        <Box sx={{ padding: 4 }}>
          <Typography variant="h5" color="error">
            No product selected. Please go back and select a product.
          </Typography>
        </Box>
      </Box>
    );
  }

  const carouselSettings = {
    vertical: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    pauseOnHover: true,
    dots:true,
  };

  return (
    <Box display="flex">
      <SideBar />
      <Box sx={{ display: "flex", flexGrow: 1,  m:1 }}>
        {/* Product Info */}
        <Box
          sx={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap:1,
          }}
        >
             
          <img
            src={`${encodeURI(product.image_url)}?f_auto,q_auto,w_600`}
            alt={product.name}
            style={{
              maxWidth: 450,
              maxHeight: 350,
              objectFit: "contain",
              borderRadius: 10,
            }}
          />
          <Box textAlign="start" p={1} maxWidth={'55%'}>
            <Typography variant="h5" >
              {product.name} 
              
            </Typography>
          
            <Box display={"flex"} alignItems="center" flexWrap={'wrap'} mr={1} my={1}>
              {product.categories.map((cat, index) => (
                <Typography key={index} fontSize={10} boxShadow={2} borderRadius={3} marginRight={0.5} p={0.5} bgcolor={'#EEEEEE'}> {cat?.name} </Typography>
                )
              )}
            </Box>
            
            <Typography variant="body1" >
              {product.description}
            </Typography>
            <Typography variant="body1" >
              {product.price == 0 ? "Contact for price" : `$${product.price}`}
            </Typography>
            <Box display={"flex"} justifyContent={"space-between"} mt={1}>                      
              <Box width='50%'><AddRemoveProduct productId={product.id}/></Box>
                <IconButton
                  component="a"
                  href={`https://wa.me/16692688087?text=${encodeURIComponent(
                    `Hi, I'm interested in this product:\n\n${product.name}\nPrice: ${
                      product.price === 0 ? "Contact for price" : `$${product.price}`
                    }\n\nImage: ${encodeURI(product.image_url)}?f_auto,q_auto,w_600\n\nIs this available?`
                  )}`}
                  target="_blank"
                  color="inherit"
                  onClick={(e) => e.stopPropagation()}
                >
                  <WhatsApp />
                </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Related Products Carousel */}
        <Box
          sx={{
            width: 270,
            p: 1,
            display: "flex",
            flexDirection: "column",
            borderLeft: "1px solid #eee",
          }}
        >
          <Typography variant="h6" mb={2}>
            Related Products
          </Typography>
          <Slider {...carouselSettings}>
            {randomRelatedProducts.map((item) => (
            
              <Box
                key={item.id}
                onClick={() =>
                  navigate("/product", {
                    state: {
                      product: item,
                      relatedProducts: relatedProducts,
                    },
                  })
                }
                
                sx={{
                  cursor: "pointer",
                  width: 240,
                  height: 160,
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  backgroundImage: `url("${encodeURI(item.image_url)}?f_auto,q_auto,w_600")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: 3,
                }}
              >
                
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    px: 2,
                    py: 1,
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    noWrap
                    title={item.name}
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="body2" fontStyle="italic">
                    {item.price === 0 ? "Contact for price" : `$${item.price}`}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>
    </Box>
  );
};

export default DisplayProduct;
