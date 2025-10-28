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
        Thank you for supporting small businesses! Sri Krishna Party Rentals LLC is a family-owned event rental company located in the Ellis community of Tracy, California.

          We offer a wide range of rental items for birthdays, graduations, get-togethers, baby showers, gender reveal parties, Indian house-warmings, and traditional Indian events. All our rental items are foldable and car-friendly, with most being brand new and meticulously cleaned.

          Our prices are competitive, and we accept Cash, Zelle, PayPal, and Venmo for your convenience. We’re open 7 days a week until late evening, so feel free to walk in anytime. Your referrals are greatly appreciated, and we are passionate about serving the community by continuously expanding our inventory with the latest trending decor items.

          For inquiries, please reach us at <a href='tel:6692688087'>669-268-8087</a> or <a href="mailto:srikrishnapartyrentals@gmail.com?subject=Order%20Inquiry&body=Hello%2C%0A%0AI%20would%20like%20to%20inquire%20about...">srikrishnapartyrentals@gmail.com
          </a>.

          Once again, thank you for your business. We look forward to making your next event truly memorable!
        </Typography>
        {/* <Typography variant="body1" paragraph>
          From weddings and birthdays to corporate events and religious ceremonies, our experienced
          team is dedicated to helping you plan and execute the perfect celebration.
        </Typography> */}
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Terms of Use Section */}
      <Box mb={6}>
        <Typography variant="h4" gutterBottom>
          ⚠️ Terms & Conditions
        </Typography>
        <Typography variant="body1" gutterBottom>
          • Your order will be confirmed only after advance payment is made.
        </Typography>
        <Typography variant="body1" gutterBottom>
          • Rental prices apply for a 24-hour period.
        </Typography>
        <Typography variant="body1" gutterBottom>
          • All orders are final — no cancellations, refunds, or exchanges will be accepted.
        </Typography>
        <Typography variant="body1" gutterBottom>
          • Items must be returned in the same condition as received.
        </Typography>
        <Typography variant="body1" gutterBottom>
          • You are responsible for any damages or liabilities during the rental period.
        </Typography>
        <Typography variant="body1" gutterBottom>
          • Delivery charges are extra, based on distance and number of items.
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
