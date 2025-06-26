import {IonText, IonCard, IonCardContent } from "@ionic/react";

const MobileAboutUs = () => {
  return (
    
      <>
        {/* About Us Section */}
        <IonCard>
          <IonCardContent>
            <IonText color="dark">
              <h2>About Us</h2>
              <p>
                Thank you for supporting small businesses. Sri Krishna Party Rentals LLC is a family-based event rental services company located in Ellis community, Tracy, California.
                We have rental items for birthday parties, graduation parties, get-togethers, baby showers, gender reveal parties, Indian housewarmings, and traditional events.
              </p>
              <p>
                All our rental items are foldable and fit in a car. Most are brand new and clean, and our prices are very reasonable. We accept Cash, Zelle, PayPal, and Venmo.
                Open 7 days a week till late evening. Walk-ins are welcome. We appreciate your referrals and continue to expand with trending decor items.
              </p>
              <p>
                Please reach us at <strong>(669) 268-8087</strong> or <strong>srikrishnapartyrentals@gmail.com</strong>. Thank you for your business!
              </p>
            </IonText>
          </IonCardContent>
        </IonCard>

        {/* Terms of Use Section */}
        <IonCard>
          <IonCardContent>
            <IonText color="dark">
              <h2>Terms of Use</h2>
              <p>
                All rental prices are based on a 24-hour period. You are required to return all rented items within 24 hours of pickup or delivery unless otherwise agreed in writing. Late returns may incur extra charges.
              </p>
              <p>
                You are fully responsible for any physical damage, loss, or misuse of rented equipment. Sri Krishna Party Rentals LLC retains ownership of all items and may charge for repair or replacement.
              </p>
              <p>
                Terms are subject to change without notice. Continued use of services implies agreement to the latest terms.
              </p>
            </IonText>
          </IonCardContent>
        </IonCard>

        {/* Privacy Policy Section */}
        <IonCard>
          <IonCardContent>
            <IonText color="dark">
              <h2>Privacy Policy</h2>
              <p>
                We value your privacy. Any data collected (e.g., name, email, phone number) is used solely for service-related communication. We do not sell or share your data.
              </p>
              <p>
                You can request deletion of your data at any time. For concerns, contact us at <strong>srikrishnapartyrentals@gmail.com</strong>.
              </p>
            </IonText>
          </IonCardContent>
        </IonCard>
      </>
  );
};

export default MobileAboutUs;
