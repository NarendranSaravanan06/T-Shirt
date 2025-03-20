import React, { useState, useEffect } from "react";
import ProductService from "../../services/productService";
import CategoryService from "../../services/categoryService";
import "../../styles/AddProduct.css";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    productName: "",
    productDescription: "",
    categoryId: "",
    gender: "male",
    variants: [
      {
        color: "",
        sizes: [{ size: "S", price: "", stock: "" }],
        images: [],
      },
    ],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleProductChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (index, e) => {
    const newVariants = [...product.variants];
    newVariants[index][e.target.name] = e.target.value;
    setProduct({ ...product, variants: newVariants });
  };

  const handleSizeChange = (vIndex, sIndex, e) => {
    const newVariants = [...product.variants];
    newVariants[vIndex].sizes[sIndex][e.target.name] = e.target.value;
    setProduct({ ...product, variants: newVariants });
  };

  const addVariant = () => {
    setProduct({
      ...product,
      variants: [
        ...product.variants,
        { color: "", sizes: [{ size: "S", price: "", stock: "" }], images: [] },
      ],
    });
  };

  const removeVariant = (vIndex) => {
    if (product.variants.length > 1) {
      const newVariants = product.variants.filter((_, index) => index !== vIndex);
      setProduct({ ...product, variants: newVariants });
    }
  };

  const addSize = (vIndex) => {
    const newVariants = [...product.variants];
    newVariants[vIndex].sizes.push({ size: "S", price: "", stock: "" });
    setProduct({ ...product, variants: newVariants });
  };

  const removeSize = (vIndex, sIndex) => {
    if (product.variants[vIndex].sizes.length > 1) {
      const newVariants = [...product.variants];
      newVariants[vIndex].sizes = newVariants[vIndex].sizes.filter(
        (_, index) => index !== sIndex
      );
      setProduct({ ...product, variants: newVariants });
    }
  };

  const handleImageUpload = (vIndex, e) => {
    const files = Array.from(e.target.files);
    const newVariants = [...product.variants];
    newVariants[vIndex].images = files.map((file) => `images/products/${file.name}`);
    setProduct({ ...product, variants: newVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ProductService.createProduct(product);
      alert("Product added successfully");
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <input type="text" name="productName" placeholder="Product Name" value={product.productName} onChange={handleProductChange} required />
        <textarea name="productDescription" placeholder="Product Description" value={product.productDescription} onChange={handleProductChange} required />

        <select name="categoryId" value={product.categoryId} onChange={handleProductChange} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
          ))}
        </select>

        <select name="gender" value={product.gender} onChange={handleProductChange} required>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="unisex">Unisex</option>
        </select>

        {product.variants.map((variant, vIndex) => (
          <div key={vIndex} className="variant-container">
            Variant:{vIndex+1}
            <input type="text" name="color" placeholder="Color" value={variant.color} onChange={(e) => handleVariantChange(vIndex, e)} required />

            {variant.sizes.map((size, sIndex) => (
              <div key={sIndex} className="size-container">
                size:{sIndex+1}
                <select name="size" value={size.size} onChange={(e) => handleSizeChange(vIndex, sIndex, e)}>
                  
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
                <input type="number" name="price" placeholder="Price" value={size.price} onChange={(e) => handleSizeChange(vIndex, sIndex, e)} required />
                <input type="number" name="stock" placeholder="Stock" value={size.stock} onChange={(e) => handleSizeChange(vIndex, sIndex, e)} required />
                <button type="button" onClick={() => removeSize(vIndex, sIndex)} disabled={variant.sizes.length === 1}>Remove Size</button>
              </div>
            ))}
            <button type="button" onClick={() => addSize(vIndex)} className="add-btn">+ Add Size</button>
            <input type="file" multiple onChange={(e) => handleImageUpload(vIndex, e)} />
            
            <button type="button" onClick={() => removeVariant(vIndex)} disabled={product.variants.length === 1}>Remove Variant</button>
           
          </div>
        ))}

        <button type="button" className="add-variant-btn" onClick={addVariant} >+ Add Variant</button>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default AddProduct;
