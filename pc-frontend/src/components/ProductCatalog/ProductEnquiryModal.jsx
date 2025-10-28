import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import { FaWhatsapp as WhatsApp} from "react-icons/fa";
import dayjs from "dayjs";

const ProductEnquiryModal = ({product, showEventDateModal = false, setShowEventDateModal}) => {
    const [eventDate, setEventDate] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        setIsMobile(checkMobile);
      }, []);
    const buildWhatsappLink = (product, availDate = '') => {
        let message = `Hi, I'm interested in this product:\n\n${product.name}\nPrice: ${
          product.price === 0 ? 'Contact for price' : `$${product.price}`
        }\n\nImage: ${encodeURI(product.image_url)}?f_auto,q_auto,w_600\n\nIs this available?`;
        if (availDate) {
          message += `\n\nEvent date: ${availDate}`;
        }
        return `https://wa.me/16692688087?text=${encodeURIComponent(message)}`;
      };
    if(!showEventDateModal)
        return;
  return (
    <Modal open={showEventDateModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                p: 4,
                borderRadius: 2,
                boxShadow: 24,
                minWidth: 300,
              }}
            >
              
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Event Date & Time"
                    value={eventDate ? dayjs(eventDate) : null} // convert to dayjs object
                    onChange={(newValue) => setEventDate(newValue)} // newValue is a dayjs object
                    renderInput={(params) => <TextField {...params} fullWidth />}
                />
                </LocalizationProvider>
              <Box mt={2} display="flex" flexDirection="column" justifyContent="flex-end" gap={1}>
                
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    const formattedDate = eventDate ? dayjs(eventDate).format('MM/DD/YYYY') : '';
                    setShowEventDateModal(false);
                    // After closing, user can click WhatsApp button again or re-implement navigation
                    // Or programmatically open WhatsApp link here if desired:
                    window.open(buildWhatsappLink(product,formattedDate), isMobile? '_self' : '_blank');
                  }}
                  disabled={!eventDate}
                >
                  Check Availability <WhatsApp size={24} style={{marginLeft:'5px'}}/>
                </Button>
                <Button variant="outlined" color="error" onClick={() => setShowEventDateModal(false)}>
                  Close
                </Button>
              </Box>
            </Box>
          </Modal>
  );
}

export default ProductEnquiryModal;