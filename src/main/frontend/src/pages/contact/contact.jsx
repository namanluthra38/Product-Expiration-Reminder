import Hdr from '../../components/hdr/hdr';
import Footer from "../../components/footer/footer";
import './contact.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";

function Contact() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const [status, setStatus] = useState(null); // "success", "error", or null

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id.replace('contact-', '')]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", message: "" });
            } else {
                throw new Error("Failed to send message");
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    return (
        <>
            <Hdr />
            <div className="contact-main-container">
                <div className="contact-container">
                    <div className="contact-left-section">
                        <h2 className="contact-title">Let's Work Together</h2>
                        <p className="contact-text">Have questions or need assistance? We're here to help! Whether you're looking for more information about our services or have a specific inquiry, feel free to reach out.</p>
                        <p className="contact-text">We are dedicated to providing the best solutions for your needs. Contact us for collaboration opportunities, support, or any other queries.</p>
                        <p className="contact-text">Your feedback is valuable to us. Let's connect and create something amazing together!</p>
                        <h2 className="contact-subtitle">Why Contact Us?</h2>
                        <ul className="contact-list">
                            <li>Need help setting up your expiry reminder system?</li>
                            <li>Have a feature request or feedback to improve our service?</li>
                            <li>Want to integrate our system into your restaurant or business?</li>
                            <li>Facing any issues with notifications or tracking?</li>
                        </ul>
                    </div>
                    <div className="contact-right-section">
                        <h3 className="contact-subtitle">How Can We Help?</h3>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <label htmlFor="contact-name" className="contact-label">Name *</label>
                            <input
                                type="text"
                                id="contact-name"
                                className="contact-input"
                                placeholder="Your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <label htmlFor="contact-email" className="contact-label">Email *</label>
                            <input
                                type="email"
                                id="contact-email"
                                className="contact-input"
                                placeholder="Your email address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <label htmlFor="contact-message" className="contact-label">Message *</label>
                            <textarea
                                id="contact-message"
                                className="contact-textarea"
                                placeholder="Tell us about your inquiry"
                                rows="6"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>

                            <button type="submit" className="contact-button">Send Message</button>

                            {status === "success" && (
                                <p style={{ color: "green", marginTop: "10px" }}>Message sent successfully!</p>
                            )}
                            {status === "error" && (
                                <p style={{ color: "red", marginTop: "10px" }}>Something went wrong. Please try again.</p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Contact;
