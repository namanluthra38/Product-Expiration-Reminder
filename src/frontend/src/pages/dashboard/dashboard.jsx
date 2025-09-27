import React, { useEffect, useState } from 'react';
import DHeader from '../../components/dashboard-header/dheader';
import Footer from "../../components/footer/footer";
import ProductCard from '../../components/product/ProductCard';
import './dashboard.css';
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      window.location.href = "signup";
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/product/products", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("jwtToken");
          window.location.href = "signup";
          return;
        }

        const data = await response.json();
        setProducts(data);
        setFiltered(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Combined filter function that applies both search and category filter
  const applyFilters = (productList, searchTerm, category) => {
    let result = productList;

    // Apply search filter
    if (searchTerm && searchTerm.trim()) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (category && category !== 'all') {
      result = result.filter(product => product.category === category);
    }

    return result;
  };

  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);

    // Apply both search and category filter
    const filteredProducts = applyFilters(products, searchQuery, selected);
    setFiltered(filteredProducts);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // If search query is empty, apply only category filter
      const filteredProducts = applyFilters(products, '', selectedCategory);
      setFiltered(filteredProducts);
      setIsSearching(false);
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      window.location.href = "signup";
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(`http://localhost:8080/product/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("jwtToken");
          window.location.href = "signup";
          return;
        }
        throw new Error('Search failed');
      }

      const searchResults = await response.json();

      // Apply category filter to search results
      const filteredResults = applyFilters(searchResults, '', selectedCategory);
      setFiltered(filteredResults);
    } catch (error) {
      console.error("Error searching products:", error);
      alert("Error searching products. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    // Apply only category filter when clearing search
    const filteredProducts = applyFilters(products, '', selectedCategory);
    setFiltered(filteredProducts);
    setIsSearching(false);
  };

  const navigate = useNavigate();
  const handleEdit = (id) => {
    localStorage.setItem("selectedProductId", id);
    navigate(`/edit-product?productId=${id}`);
  };

  const handleAnalyse = (id) => {
    localStorage.setItem("selectedProductId", id);
    navigate(`/product-analyse?productId=${id}`);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      window.location.href = "signup";
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/product/id/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
        return;
      }

      alert("Product deleted successfully!");

      // Update both products and filtered arrays
      const updatedProducts = products.filter(p => p.strid !== id);
      setProducts(updatedProducts);

      // Reapply filters after deletion
      const filteredProducts = applyFilters(updatedProducts, searchQuery, selectedCategory);
      setFiltered(filteredProducts);
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("An error occurred while deleting the product. Please try again.");
    }
  };

  return (
    <div className="dashboard-full-page">
      <DHeader />
      <div className="dashboard-page">
        <div className="filter-container">

          <div className="search-container">
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              className="dashboard-search-input"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="dashboard-search-button"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="dashboard-clear-button"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            id="categoryFilter"
            className='dashboard-filter'
            value={selectedCategory}
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            <option value="Dairy">Dairy</option>
            <option value="Grocery">Grocery</option>
            <option value="Beverages">Beverages</option>
            <option value="Snacks">Snacks</option>
            <option value="Hygiene">Hygiene</option>
            <option value="Medicine">Medicine</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div className="dashboard-product-container">
          {filtered.length === 0 ? (
            <div className="no-products-message">
              {searchQuery && selectedCategory !== 'all'
                ? `No products found matching "${searchQuery}" in ${selectedCategory} category`
                : searchQuery
                ? `No products found matching "${searchQuery}"`
                : selectedCategory !== 'all'
                ? `No products found in ${selectedCategory} category`
                : 'No products found'
              }
            </div>
          ) : (
                filtered.map(product => (
                    <ProductCard
                      key={product.strid}
                      product={product}
                      onEdit={handleEdit}
                      onAnalyse={handleAnalyse}
                      onDelete={handleDelete}
                    />
                ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
