import { useEffect, useState } from "react";
import ProductCard from "../../components/seller/ProductCard";
import { Row, Col, Input, Button, Select, Slider, Spin } from "antd";
import { fetchProducts } from "../../api/ProductService";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [, setSortOrder] = useState("asc");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const productsData = await fetchProducts();
      if (productsData) {
        setProducts(productsData);
        setFilteredProducts(productsData);
      }
      setLoading(false);
    };

    getProducts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (value === "asc") {
        return a.averageRating - b.averageRating;
      } else {
        return b.averageRating - a.averageRating;
      }
    });
    setFilteredProducts(sortedProducts);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const filterProducts = (searchValue, priceRange) => {
    let searchResults = products;
    if (searchValue) {
      searchResults = searchResults.filter((product) =>
        product.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    searchResults = searchResults.filter((product) => {
      if (priceRange[1] === 3000) {
        return product.price >= priceRange[0];
      }
      return product.price >= priceRange[0] && product.price <= priceRange[1];
    });
    setFilteredProducts(searchResults);
  };

  const handleGoClick = () => {
    filterProducts(searchValue, priceRange);
  };

  const formatPriceRange = () => {
    if (priceRange[1] === 3000) {
      return `$${priceRange[0]} - $${priceRange[1]} & above`;
    }
    return `$${priceRange[0]} - $${priceRange[1]}`;
  };

  return (
    <div className="productList" style={{ display: "flex" }}>
      <div
        style={{
          width: "20%",
          padding: "10px",
          backgroundColor: "#f3f3f3",
          borderRadius: "5px",
          marginRight: "10px",
        }}
      >
        <h2>Filter & Sort</h2>
        <div style={{ marginBottom: "10px" }}>
          <h3>Price Range</h3>
          <div style={{ marginBottom: "10px" }}>{formatPriceRange()}</div>
          <Slider
            range
            min={0}
            max={3000}
            value={priceRange}
            onChange={handlePriceChange}
            style={{ marginBottom: "10px" }}
          />
          <Button
            type="primary"
            style={{ width: "100%" }}
            onClick={handleGoClick}
          >
            Go
          </Button>
        </div>
        <Select
          defaultValue="asc"
          style={{ width: "100%" }}
          onChange={handleSortChange}
        >
          <Option value="asc">Sort by Rating: Low to High</Option>
          <Option value="desc">Sort by Rating: High to Low</Option>
        </Select>
      </div>
      <div style={{ width: "80%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Button type="primary" onClick={() => navigate("/create-product")}>
            Create Product
          </Button>
          <Search
            placeholder="Search products by name"
            onChange={handleSearchChange}
            style={{ width: 300 }}
            allowClear
            onSearch={handleGoClick}
          />
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <div className="productGrid">
            <Row gutter={[16, 16]}>
              {filteredProducts &&
                filteredProducts.map((product) => (
                  <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                    <ProductCard
                      id={product._id}
                      name={product.name}
                      description={product.description}
                      price={product.price}
                      picture={product.picture}
                      seller={product.seller.name}
                      quantity={product.quantity}
                      rating={product.averageRating} // Pass the averageRating to ProductCard
                    />
                  </Col>
                ))}
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
