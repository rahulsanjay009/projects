import { useEffect, useState } from "react";
// React Slick
import Slider from 'react-slick';

// MUI (optimized)
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import APIService from "../../services/APIService";

const LatestProductsCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    APIService().fetchLatestProducts()
      .then((res) => {
        console.log(res)
        if(res?.success)
            setProducts(res?.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch latest products", err);
        setLoading(false);
      });
  }, []);

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
    <Typography padding={'5px'} fontSize={'30px'} sx={{px:1}}> Newly Launched</Typography>
    <Box sx={{ maxWidth:'100%',my:1}}>
      <Slider {...settings}>
        {products.map((product) => (
          <Box key={product.id} px={1}>
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

export default LatestProductsCarousel;
