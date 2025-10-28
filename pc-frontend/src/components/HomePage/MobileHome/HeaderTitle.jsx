import { IonTitle, IonText } from '@ionic/react';
import Box from '@mui/material/Box';

// Assuming 'category' is passed as a prop
const HeaderTitle = ({ category }) => {
  return (
    <IonTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap:1 }}>
            <a href="/">
                <img
                src="https://res.cloudinary.com/dmm4awbwm/image/upload/f_auto,q_auto/tsee5mrm7cymclmefpic"
                alt="Kitten"
                height={35}
                width={35}
                />
            </a>
            {!category || category === '/ALL' ? (
                <div
                style={{
                    // Layout for the two-line name
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    lineHeight: '1.2',
                    overflow: 'hidden',
                    flexGrow: 1, // Allows this block to take up available space
                }}
                >
                {/* Use IonText as display: block for clean line breaks */}
                <IonText style={{ display: 'block', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                    Sri Krishna
                </IonText>
                <IonText style={{ display: 'block', whiteSpace: 'nowrap', fontSize: '0.9em' }}>
                    Party Rentals LLC
                </IonText>
                </div>
            ) : (
                // Single-line Category Name with Ellipsis (No Vertical Overflow)
                <IonText
                style={{
                    flexGrow: 1, // Allows text to consume available space
                    minWidth: 0, // CRUCIAL for flex items with overflow: hidden
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: 'bold',
                }}
                >
                {category.replace('/', '')}
                </IonText>
            )}
        </Box>
    </IonTitle>
  );
};

export default HeaderTitle;