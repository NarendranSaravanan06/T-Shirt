import React, { useState, useEffect } from "react";
import ProductService from "../../services/productService";
import CategoryService from "../../services/categoryService";
import "../../styles/EditProduct.css";

const EditProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await ProductService.getAllProducts();
        const categoryData = await CategoryService.getAllCategories();
        setProducts(productData);
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    Object.values(product).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
  };

  const handleDelete = async (productId) => {
    try {
      await ProductService.deleteProduct(productId);
      setProducts(products.filter((p) => p.productId !== productId));
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const handleProductChange = (e) => {
    setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (index, e) => {
    const newVariants = [...editingProduct.variants];
    newVariants[index][e.target.name] = e.target.value;
    setEditingProduct({ ...editingProduct, variants: newVariants });
  };

  const handleSizeChange = (vIndex, sIndex, e) => {
    const newVariants = [...editingProduct.variants];
    newVariants[vIndex].sizes[sIndex][e.target.name] = e.target.value;
    setEditingProduct({ ...editingProduct, variants: newVariants });
  };

  const addVariant = () => {
    setEditingProduct({
      ...editingProduct,
      variants: [...editingProduct.variants, { color: "", sizes: [{ size: "S", price: "", stock: "" }], images: [] }],
    });
  };

  const addSize = (vIndex) => {
    const newVariants = [...editingProduct.variants];
    newVariants[vIndex].sizes.push({ size: "S", price: "", stock: "" });
    setEditingProduct({ ...editingProduct, variants: newVariants });
  };

  const removeVariant = (index) => {
    if (editingProduct.variants.length > 1) {
      setEditingProduct({
        ...editingProduct,
        variants: editingProduct.variants.filter((_, i) => i !== index),
      });
    }
  };

  const removeSize = (vIndex, sIndex) => {
    if (editingProduct.variants[vIndex].sizes.length > 1) {
      const newVariants = [...editingProduct.variants];
      newVariants[vIndex].sizes.splice(sIndex, 1);
      setEditingProduct({ ...editingProduct, variants: newVariants });
    }
  };

  const handleImageUpload = (vIndex, e) => {
    const files = Array.from(e.target.files);
    const newVariants = [...editingProduct.variants];
    newVariants[vIndex].images = files.map((file) => `images/products/${file.name}`);
    setEditingProduct({ ...editingProduct, variants: newVariants });
  };

  const handleUpdate = async () => {
    try {
      await ProductService.updateProduct(editingProduct);
      alert("Product updated successfully");
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearch} />
      <ul className="product-list">
        {filteredProducts.map((product) => (
          <li key={product.productId}>
            <img src={product.variants[0]?.images[0] || "default.jpg"} alt={product.productName} />
            <span>{product.productName} - {product.categoryName}</span>
            <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
            <button className="delete-btn" onClick={() => handleDelete(product.productId)}>Delete</button>
          </li>
        ))}
      </ul>
      {editingProduct && (
        <div className="edit-form floating-window">
          <div className="edit-header">
            <h3>Edit Product</h3>
            <button className="close-btn" onClick={() => setEditingProduct(null)}>X</button>
          </div>
          <div className="edit-content">
            <input type="text" name="productName" value={editingProduct.productName} onChange={handleProductChange} />
            <textarea name="productDescription" value={editingProduct.productDescription} onChange={handleProductChange} />
            <select name="categoryId" value={editingProduct.categoryId} onChange={handleProductChange}>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
              ))}
            </select>
            {editingProduct.variants.map((variant, vIndex) => (
              <div key={vIndex} className="variant-section">
                <input type="text" name="color" value={variant.color} onChange={(e) => handleVariantChange(vIndex, e)} />
                {variant.sizes.map((size, sIndex) => (
                  <div key={sIndex} className="size-section">
                    <input type="number" name="price" value={size.price} onChange={(e) => handleSizeChange(vIndex, sIndex, e)} />
                    <button className="remove-size-btn" onClick={() => removeSize(vIndex, sIndex)}>Remove Size</button>
                  </div>
                ))}
                <button className="remove-variant-btn" onClick={() => removeVariant(vIndex)}>Remove Variant</button>
                <input type="file" multiple onChange={(e) => handleImageUpload(vIndex, e)} />
              </div>
            ))}
            <button className="add-variant-btn" onClick={addVariant}>+ Add Variant</button>
            <button className="update-btn" onClick={handleUpdate}>Update</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct;