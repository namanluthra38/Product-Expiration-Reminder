import './about.css';
import Hdr from '../../components/hdr/hdr';
import Footer from "../../components/footer/footer";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Image from '../../assets/img7.png';

function About() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    function scrollToFAQ() {
        const faqSection = document.getElementById("faq");
        if (faqSection) {
            faqSection.scrollIntoView({ behavior: "smooth" });
        }
    }

    return (
        <>
            <Hdr />
            <div className="about-page">
                <section className="about-us-section">
                    <div className="about-us-content">
                        <h2>About Us</h2>
                        <p>At VERFALARM, we believe in reducing food waste by keeping track of food expiry dates effortlessly. Our goal is to help you save money, eat fresh, and contribute to a more sustainable future.</p>
                        <button className="learn-more-button" onClick={scrollToFAQ}>Learn More</button>
                    </div>
                    <div className="about-us-image-container">
                        <img src={Image} alt="Happy person with pet" />
                    </div>
                </section>

                <section className="about-us-faq-section" id="faq">
                    <h2>Frequently Asked Questions</h2>
                    <div className="about-us-faq">
                        <h3>1. What is the Food Expiry Reminder System?</h3>
                        <p>It is a web-based tool that helps users keep track of food expiry dates, reducing waste and promoting better food management.</p>
                    </div>
                    <div className="about-us-faq">
                        <h3>2. How can I use this system?</h3>
                        <p>You can sign up on our website, enter your food items, set expiry dates, and receive notifications before they expire.</p>
                    </div>
                    <div className="about-us-faq">
                        <h3>3. Is this project open-source?</h3>
                        <p>Yes! The project is open-source, and you can contribute on <a href="#">GitHub</a>.</p>
                    </div>
                    <div className="about-us-faq">
                        <h3>4. Can I suggest new features?</h3>
                        <p>Absolutely! Send us your suggestions via email or social media.</p>
                    </div>
                    <div className="about-us-faq">
                        <h3>5. Will there be a mobile app version?</h3>
                        <p>We plan to expand this into a mobile app soon. Stay tuned for updates!</p>
                    </div>
                </section>

                <section className="about-us-contact-info-section">
                    <h2>Need to Reach Us?</h2>
                    <p>If you have any questions, feedback, or suggestions, feel free to get in touch with us through our dedicated Contact Us page.</p>
                    <p>Click the button below to visit the Contact Us page and send us a message.</p>
                    <Link to="/contact" className="about-us-contact-button">Contact Us</Link>
                </section>

                <section className="about-us-mission-section">
                    <h2>Our Mission – Reducing Food Waste, One Reminder at a Time</h2>
                    <p>Food wastage is a global issue, and we believe small steps can make a big impact. By using our system, you’re taking a step towards a sustainable future. 🌿♻</p>
                    <p>Thank you for supporting our project!</p>
                </section>
            </div>
            <Footer />
        </>
    );
}

export default About;
