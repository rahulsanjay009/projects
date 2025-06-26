import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  color: 'white',
  mb:2,
  margin: '10px 0px 10px 0px',
  borderRadius:'0px',
  zIndex: 1,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: -1,
    backgroundImage: `linear-gradient(
      135deg,
      #cda132ac,
      #cda1324c,
      #d7ad2335,
      rgba(0, 0, 0, 0.5)
    ), url('https://res.cloudinary.com/dmm4awbwm/image/upload/f_auto,q_auto/fkzbvjgplyyvtfsbgtij')`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    filter: 'brightness(0.5)', // This dims the background only
  },
}));

export default StyledCard