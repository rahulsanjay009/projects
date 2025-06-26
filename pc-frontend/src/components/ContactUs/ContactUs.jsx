
import Box from '@mui/material/Box';
import  IconButton  from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { FaWhatsapp as WhatsApp, FaInstagram as Instagram} from 'react-icons/fa';
import { HiOutlineMail as OutgoingMail } from 'react-icons/hi';

const ContactUs = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: '#282c34',
        color: 'white',
        position: 'relative',
        bottom: 0,
        width: '100%',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Contact Us
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        {/* WhatsApp Icon */}
        <IconButton
          component={Link}
          href="https://wa.me/16692688087" // Replace with your WhatsApp number link
          target="_blank"
          color="inherit"
        >
          <WhatsApp />
        </IconButton>

        {/* Instagram Icon */}
        <IconButton
          component={Link}
          href="https://instagram.com/skprllc" // Replace with your Instagram profile link
          target="_blank"
          color="inherit"
        >
          <Instagram />
        </IconButton>

        {/* OutgoingMail Icon */}
        <IconButton
          component={Link}
          href="mailto:srikrishnapartyrentals@gmail.com" // Replace with your OutgoingMail address
          target="_blank"
          color="inherit"
        >
          <OutgoingMail />
        </IconButton>
      </Box>

      <Typography variant="body2" sx={{ marginTop: '12px' }}>
        © {new Date().getFullYear()} Sri Krishna Party Rentals LLC. All rights reserved.
      </Typography>
    </Box>
  );
};

export default ContactUs;
