import React from 'react';
import '../styles/Terms.css';

const Terms = () => {
    return (
        <div className="legal-container">
            <div className="legal-card">
                <h1>Terms & Conditions</h1>
                <p className="last-updated">Last Updated: January 2026</p>
                
                <section>
                    <h3>1. Booking Policy</h3>
                    <p>All bookings made through EventPro are final. Tickets are issued as digital QR codes and must be presented at the venue.</p>
                </section>

                <section>
                    <h3>2. Refund & Cancellation</h3>
                    <p>Refunds are only processed if an event is cancelled by the organizer. Service fees are non-refundable.</p>
                </section>

                <section>
                    <h3>3. User Conduct</h3>
                    <p>Users must provide accurate information during signup. Any fraudulent activity will lead to account suspension.</p>
                </section>
            </div>
        </div>
    );
};

export default Terms;