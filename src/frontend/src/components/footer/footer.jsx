import './footer.css';

function footer(){
    return(
        <section id="footer">
  <div className="column">
    <h4>Contact</h4>
    <p>Address: #17, Eldian Complex, Sector-17, Chandigarh, INDIA</p>
    <p>Phone: +91-6889328XXX</p>
    <p className="sma">+91-9909378XXX</p>
    <p className="sma">+91-7889328XXX</p>
    <p>24*7 Customer Support</p>
  </div>

  <div className="column ptffoot">
    <a href="/" className="follow">Verfalarm</a>
    <a href="/product"><span>Set Reminder</span></a>
    <a href="/dashboard"><span>Manage Reminders</span></a>
    <a href="about"><span>How It Works</span></a>
    <a href="#" className="follow">Follow Us</a>

    <div className="footsma">
      <i className="fab fa-facebook-f"></i>
      <i className="fab fa-instagram"></i>
      <i className="fab fa-twitter"></i>
    </div>
  </div>

  <div className="column">
    <a href="#" className="follow">Help</a>
    <a href="/about"><span>About Us</span></a>
    <a href="/contact"><span>Contact Us</span></a>
    <a href="#"><span>Privacy Policy</span></a>
    <a href="#"><span>Terms of Service</span></a>

    <br />
    <h6>
      Copyright <i className="far fa-copyright"></i> Verfalarm
    </h6>
  </div>
</section>
    );
}
export default footer;