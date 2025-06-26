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
                Srikrishna Party Rentals LLC is an event rental and event decoration services company located in Cordelia Ln, Tracy, CA 95377, United States. Our professional team can help you plan an amazing event Party Rentals that meets all of your needs. We provide everything from party rental supplies to custom decoration services. Our goal is to make every event memorable for you.
                </Typography>
            </CardContent>
        </StyledCard>
        {loading? <CircularProgress value={75} size={80} color={'success'}/> : <CategoryCards categories={categories}/> }
        <CardCarousel events={events}/>
        <LatestProductsCarousel/>
    </Box>
)};

export default HomeLanding;
