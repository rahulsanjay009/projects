
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonItem, IonLabel } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

const MobileCardCarousel = ({events}) => {
  

  return (
    <>
    <IonItem>
    <IonLabel style={{textAlign:'center'}}> Recent Events </IonLabel>
    </IonItem>
    <Swiper
      spaceBetween={10}
      slidesPerView={1.2}
      breakpoints={{
        640: { slidesPerView: 2.2 },
        992: { slidesPerView: 3.2 },
        1200: { slidesPerView: 4.2 },
      }}
    >
      {events.map((card, idx) => (
        <SwiperSlide key={idx}>
          <IonCard>
            <IonImg src={card.image_url} />
            <IonCardHeader>
              <IonCardTitle>{card.event_name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>{card.event_description}</IonCardContent>
          </IonCard>
        </SwiperSlide>
      ))}
    </Swiper>
    </>
  );
};

export default MobileCardCarousel;
