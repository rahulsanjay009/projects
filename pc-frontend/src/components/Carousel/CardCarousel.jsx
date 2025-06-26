
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const CardCarousel = ({events}) => {


  return (
    <Box padding={'10px'}>      
      <Typography padding={'5px'} fontSize={'30px'}> Recent Events </Typography>
      <Swiper
        spaceBetween={16}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          992: { slidesPerView: 3.2 },
          1200: { slidesPerView: 4.2 },
        }}
      >
        {events.map((card, idx) => (
          <SwiperSlide key={idx}>
            <Card sx={{ maxWidth: 320, m:2 }}>
              <CardMedia
                component="img"
                height="250"
                image={card.image_url}
                alt={card.event_name}
              />
              <CardHeader title={card.event_name} />
              <CardContent>
                <Typography variant="body1" color="text.secondary">
                  {card.event_description}
                </Typography>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default CardCarousel;
