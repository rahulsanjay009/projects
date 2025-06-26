import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const preloadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = resolve;
  });

const CategoryCards = ({ categories = [] }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const defaultImage = 'https://res.cloudinary.com/dmm4awbwm/image/upload/v1746672352/rlrckqhdnfdnvohwt4xb.png';
  const allImage = 'https://thumbs.dreamstime.com/b/event-supplies-flat-glyph-icons-party-equipment-stage-constructions-visual-projector-stanchion-flipchart-marquee-signs-115703883.jpg';

  useEffect(() => {
    const imageUrls = [
      allImage,
      ...categories.map((cat) => cat.image_url || defaultImage),
    ];

    Promise.all(imageUrls.map(preloadImage)).then(() => {
      setLoading(false);
    });
  }, [categories]);

  const handleClick = (path) => {
    navigate(path);
  };

  const cardStyle = {
    width: 180,
    m: 1,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: 6,
    },
  };

  const imageStyle = {
    width: 100,
    height: 100,
    objectFit: 'cover',
    borderRadius: 4,
  };

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center" className="categories_cards">
      {/* All Category Card */}
      <Card onClick={() => handleClick('/ALL')} sx={cardStyle}>
        <CardContent>
          <img src={allImage} alt="All" style={imageStyle} />
          <Typography variant="body1" mt={1}>All</Typography>
        </CardContent>
      </Card>

      {/* Category Cards */}
      {categories.map((cat) => (
        <Card
          key={cat.id || cat.name}
          onClick={() => handleClick(`/${encodeURIComponent(cat.name)}`)}
          sx={cardStyle}
        >
          <CardContent>
            
            <img
              src={ encodeURI(cat.image_url || defaultImage) }
              alt={cat.name}
              style={imageStyle}
            />
            <Typography variant="body2" fontSize={14} fontWeight={300} mt={1}>
              {cat.name}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default CategoryCards;
