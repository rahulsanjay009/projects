// React hooks
import { useEffect, useState } from 'react';

// React Slick carousel
import Slider from 'react-slick';

// MUI components (optimized)
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// Ionic components (keep as is, no per-component path available)
import { IonItem, IonLabel } from '@ionic/react';

// API service (your own code)
import APIService from '../../services/APIService';

// React Router hook
import { useNavigate } from 'react-router-dom';

const MobileLatestProductsCarousel = ({productsData = []}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  
  const getRandomItems = (products) => {
    if (!products || products.length <= 10) return products || [];
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 10);
  };
  useEffect(() => {
    // console.log("productsData", productsData);
    if (Array.isArray(productsData) && productsData.length > 0) {
      setProducts(getRandomItems(productsData));
      setLoading(false);
      return;
    } 
    APIService().fetchLatestProducts()
      .then((res) => {
        if(res?.success)
            setProducts(res?.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch latest products", err);
        setLoading(false);
      });
  }, [productsData]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "20px",
    responsive: [
      {
        breakpoint: 960,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
    <IonItem>
      <IonLabel style={{textAlign:'center'}}> 
        {Array.isArray(productsData) && productsData.length > 0 ? 'Related Products' : 'Newly Launched'}
      </IonLabel>
    </IonItem>
    <Box sx={{ maxWidth:'100%', mt:1}} >
      <Slider {...settings}>
        {products.map((product) => (
          <Box key={product.id} px={1} onClick={() => productsData != null && navigate('/product',{ state: {product, relatedProducts: products} })}>
            <Box
              sx={{
                height: 325,
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 4,
                backgroundImage: `url("${encodeURI(product.image_url)}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  p: 2,
                  background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
                  color: "#fff",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {product.name}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
      <br/>
    </Box>
    </>
  );
};

export default MobileLatestProductsCarousel;
