import React, { useState } from "react";
import CategoryService from "../../services/categoryService";
const AddCategory = () => {



    const [category, setCategory] = useState({categoryName: "", categoryDescription: ""}); 



    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await CategoryService.createCategory(category);
            alert("categoru added successfully");
        } catch (error) {
            console.error("Error adding category", error);
        }
    };

    return (
        <div className="add-product-container">
            <h2>Add Product</h2>
            <form className="add-product-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Category Name"
                    value={category.categoryName}
                    onChange={(e) => setCategory({...category, categoryName: e.target.value})}/>
                <textarea
                    placeholder="Category Description"
                    value={category.categoryDescription}
                    onChange={(e) => setCategory({...category, categoryDescription: e.target.value})}/>
                <button type="submit" className="submit-btn">Submit</button>
            </form>
        </div>
    );
};


export default AddCategory
