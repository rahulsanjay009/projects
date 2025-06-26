import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const AboutUs = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* About Us Section */}
      <Box mb={6}>
        <Typography variant="h4" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" paragraph>
        Thank you for supporting small businesses. Sri Krishna Party Rentals LLC is a family-based event rental services company located in Ellis community Tracy California.
        We have rental items for Birthday parties, Graduation parties, Get togethers, baby shower, gender reveal parties, Indian house-warming and Indian traditional events.  All our rental items are foldable and fits in the car. Most of our rental items are brand new and clean. Our prices are very reasonable compared to the market. We accept Cash, Zelle, PayPal and Venmo payments. We are open on all 7 days till late evening. You can walk in any day. We appreciate your referrals. We are passionate on serving the community and keep on increasing our inventory with latest trending decor items. 
        Please reach us @ 669 268 8087 or srikrishnapartyrentals@gmail.com. 
        Once again thank you for your business. See you soon.
        </Typography>
        <Typography variant="body1" paragraph>
          From weddings and birthdays to corporate events and religious ceremonies, our experienced
          team is dedicated to helping you plan and execute the perfect celebration.
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Terms of Use Section */}
      <Box mb={6}>
        <Typography variant="h4" gutterBottom>
          Terms of Use
        </Typography>
        <Typography variant="body1" >
        All rental prices are based on a 24-hour period. You are required to return all rented items within 24 hours of pickup or delivery unless otherwise agreed upon in writing. Failure to return items on time may result in additional charges.

        You are fully responsible for any physical damage, loss, or misuse of the rented equipment during the rental period. Sri Krishna Party Rentals LLC retains ownership of all rental items and reserves the right to charge for repair or replacement in the event of damage or non-return.

        
        </Typography>
        <Typography variant="body1" >
        We may update these terms at any time without prior notice. Continued use of our services constitutes acceptance of the most current terms.
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Privacy Policy Section */}
      <Box>
        <Typography variant="h4" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          We value your privacy. Any information collected from you (such as name, email, or phone
          number) is used solely for communication and service purposes. We do not sell or share
          your personal information with third parties.
        </Typography>
        <Typography variant="body1" paragraph>
          You have the right to request the deletion of your data at any time. For any privacy
          concerns, please contact us at <strong>srikrishnapartyrentals@gmail.com</strong>.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUs;
