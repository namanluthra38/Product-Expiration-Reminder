import Image from '../../assets/img1.png';
import Image1 from '../../assets/img2.jpg';
import Image2 from '../../assets/img3.jpg';
import Image3 from '../../assets/img4.jpg';
import Image4 from '../../assets/img5.jpg';
import Image5 from '../../assets/img6.jpg';
import Image8 from '../../assets/img8.png';
import Image7 from '../../assets/img7.png';
import Image9 from '../../assets/img10.png';
import Image11 from '../../assets/img11.png';
import './Home.css';
// import Hdr from "../../components/hdr/hdr";
import Footer from "../../components/footer/footer";
import Faq from "../../components/faq/faq";
import Hdr from '../../components/hdr/hdr';
import Flashcard from '../../components/flashcard/flashcard';

import { useEffect } from "react";
import ItemForm from '../../components/item-form/itemform';
import DrawerMobileNavigation from '../../components/DrawerMobileNavigation/DrawerMobileNavigation';



function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);
  return (
    <>
    
    <Hdr/>

    
    

      <div className="hero">
        <div className="para">
          <h1>Welcome to Verfalarm!</h1>
          <h3>Stay Organized, Never Miss An Expiry.</h3>
          <p>Verfalarm is your smart reminder companion, helping you keep track of product expirations. Get notified before it's too late.</p>
        </div>

        <div>
          <img className="img1" src={Image7} alt='profile pic' />
        </div>

        
      </div>



      <div>
        <div className="why">
          <h1>Why Verfalarm? </h1>
        </div>
        <Flashcard/>
        
      </div>



      <div className='hor-cards'>
        <div className='rec-card1'>
          <div className='c1h'>
          <h1>Reliable & Timely</h1>
          <h2>Track your groceries, medicines, and other essentials effortlessly. Stay updated, save money, and reduce waste with timely reminders.</h2>
          </div>
          
          <div className='img-11'>
          <img className="img11" src={Image11} alt="User-Friendly Interface" />
          </div>
         
        </div>
        
      
  
        <div className='rec-card2'>
          <div className='img-9'>
          <img className="img9" src={Image9} alt="User-Friendly Interface" />
          </div>
          
        
        <div className='c2h'>
        <h1> Analytics & Insights</h1>
        <h2>Track your reminder habits with useful insights.</h2>
        </div>
        </div>
        <div className='rec-card1'>
          <div className='c1h'>
          <h1>🌱 Smarter Consumption</h1>
          <h2>
          Reduce waste, save money, and make sustainable choices by keeping track of what you use — and when.</h2>
          </div>
          
          <div className='img7'>
          <img className="img-7" src={Image8} alt="User-Friendly Interface" />
          </div>
         
        </div>

        </div>


    

<Faq/>


      <Footer/>





      
    </>
  );
}

export default Home;
