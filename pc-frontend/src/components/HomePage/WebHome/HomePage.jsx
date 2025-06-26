// HomePage.jsx
import Box  from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import ResponsiveMenu from './ResponsiveMenu';
import ContactUs from '../../ContactUs/ContactUs';
import useCategories from '../../../utils/useCategories';

const HomePage = () => {
    const { categories, loading } = useCategories();

    return (
        <Box sx={{ height: '100vh', overflowY: 'auto' , overflowX:'hidden',
            "&::-webkit-scrollbar": {
                width: "4px", // set desired width
              },
              "&::-webkit-scrollbar-thumb": {
            backgroundColor: "black", // thumb color
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1", // track color
          }}}>
              { loading && <div className='loader-overlay'> <div className='loader'> </div> </div>}
            <ResponsiveMenu categories={categories} />
            <Outlet />
            <ContactUs/>
        </Box>
    );
};

export default HomePage;
