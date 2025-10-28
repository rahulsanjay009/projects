import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import StyledCard from './StyledCard';
import CardCarousel from '../../Carousel/CardCarousel';
import useEvents from '../../../utils/useEvents';
import useCategories from '../../../utils/useCategories';
import CategoryCards from './CategoryCards';
import LatestProductsCarousel from '../../Carousel/LatestProductsCarousel';

const HomeLanding = () => {
    const {events} = useEvents()
    const {categories,loading} = useCategories()
    return (
    <Box>
        <StyledCard sx={{ padding: '15px' }}>
            <CardContent sx={{ padding: '15px' }}>
                <Typography fontSize={'46px'}>
                    It's Your Day, Make It Memorable.
                </Typography>
                <br />
                <Typography fontSize={'20px'}>
                Srikrishna Party Rentals LLC is a premier event rental and setup service provider based in Cordelia Ln, Tracy, CA 95377, USA. From weddings and birthdays to corporate events and religious ceremonies, our experienced team is dedicated to helping you plan and execute the perfect celebration. We handle every detail professionally, ensuring your special occasion is seamless, stress-free, and truly memorable.
                </Typography>
            </CardContent>
        </StyledCard>
        {loading? <CircularProgress value={75} size={80} color={'success'}/> : <CategoryCards categories={categories}/> }
        <CardCarousel events={events}/>
        <LatestProductsCarousel/>
    </Box>
)};

export default HomeLanding;
