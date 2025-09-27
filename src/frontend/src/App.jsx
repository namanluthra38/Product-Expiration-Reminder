

import About from './pages/about/about.jsx';
import Contact from './pages/contact/contact.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';
import EditProduct from './pages/edit-product/EditProduct.jsx';
import EditUser from './pages/edit-user/EditUser.jsx';
import Home from './pages/Home/Home.jsx';
import ProductAnalysis from './pages/analysis/analysis.jsx';
import Product from './pages/product/product.jsx';
import Signup from './pages/Signup/Signup.jsx'
import { BrowserRouter, Route, Routes } from "react-router-dom";


function App() {
  return <BrowserRouter>
  <Routes>
    
    <Route path="/" element={<Home/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path="/about" element={<About/>}/>
    <Route path="/product" element={<Product/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/edit-product" element={<EditProduct/>}/>
    <Route path="/edit-user" element={<EditUser/>}/>
    <Route path="/product-analyse" element={<ProductAnalysis/>}/>
    
  


  </Routes>
  </BrowserRouter>
}

export default App;
