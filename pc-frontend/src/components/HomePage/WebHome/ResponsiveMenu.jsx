import { useState, useMemo } from 'react';
import { useNavigate, useLocation, redirect } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import { MdArrowDropDown as ArrowDropDownIcon, MdShoppingCart as ShoppingCartIcon } from 'react-icons/md';
import { useSelector } from 'react-redux';

const ResponsiveMenu = ({ categories }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemCount = useSelector((state) => state?.CartReducer?.products?.length || 0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const allCategories = useMemo(() => ['ALL', ...categories.map((c) => c.name)], [categories]);

  const currentPath = decodeURIComponent(location.pathname).slice(1).toLowerCase();

  const isActive = (routeName) => {
    const normalizedRoute = routeName.toLowerCase();
    return (
      (normalizedRoute === 'home' && currentPath === '') ||
      currentPath === normalizedRoute
    );
  };

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (category) => {
    const route = category.toLowerCase() === 'home' ? '/' : `/${encodeURIComponent(category)}`;
    navigate(route);
    handleClose();
  };

  return (
    <AppBar position="static" color="success">
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        {/* Logo & Address Section */}
        <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center'}}>
          <a href='/' style={{ cursor: 'pointer' }}>
            <img
              src="https://res.cloudinary.com/dmm4awbwm/image/upload/f_auto,q_auto/tsee5mrm7cymclmefpic"
              alt="Logo"
              height="50"
              width="50"
            />
          </a>
          <a href='/' style={{ cursor: 'pointer', color:'white', textDecoration:'none' }}>
          <Box onClick={()=>{redirect('/')}}>
            <Typography fontWeight="bold">Sri Krishna</Typography>
            <Typography variant="body2">Party Rentals LLC</Typography>
          </Box>
          </a>
          <Typography variant="body2" pl={2}>
            2619 Cordeila Ln, Tracy, CA 95377
          </Typography>
        </Box>

        {/* Navigation Section */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={() => handleSelect('Home')}
            sx={{
              color: isActive('home') ? 'yellow' : 'white',
              fontWeight: isActive('home') ? 'bold' : 'normal',
            }}
          >
            Home
          </Button>

          <Button
            onClick={handleMenuClick}
            sx={{
              color: currentPath && allCategories.some(cat => cat.toLowerCase() === currentPath) ? 'yellow' : 'white',
              fontWeight: 'normal',
            }}
          >
            Rentals <ArrowDropDownIcon />
          </Button>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            {allCategories.map((name, index) => (
              <MenuItem key={index} onClick={() => handleSelect(name)}>
                {name}
              </MenuItem>
            ))}
          </Menu>

          <Button
            onClick={() => navigate('/about')}
            sx={{
              color: isActive('about') ? 'yellow' : 'white',
              fontWeight: isActive('about') ? 'bold' : 'normal',
            }}
          >
            About Us
          </Button>
          <Button onClick={() => navigate('/cart')}
            sx={{
              color: isActive('about') ? 'yellow' : 'white',
              fontWeight: isActive('about') ? 'bold' : 'normal',
            }}>
            <Badge
              badgeContent={cartItemCount}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.75rem",
                  height: "20px",
                  minWidth: "20px",
                  borderRadius: "50%",
                },
              }}
            >
              <ShoppingCartIcon style={{ fontSize: '28px', color:'white' }} />
            </Badge>

          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ResponsiveMenu;
