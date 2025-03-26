import React from 'react'
import Button from '../../components/reusables/Button'
import { useNavigate } from 'react-router-dom'
import '../../styles/AdminPage.css'

const AdminPage = () => {
  const navigate = useNavigate();
  return (
    <div className='admin-page'>
      <h1>Admin Page</h1>
      <Button label="Add Product" onClick={()=>navigate('/admin/add-product')} color='red' size='medium'></Button>
      <Button label="Edit Product" onClick={()=>navigate('/admin/edit-product')} color='red' size='medium'></Button>
      <Button label="Add Category" onClick={()=>navigate('/admin/add-category')} color='red' size='medium'></Button>
      <Button label="Edit Category"  color='red' size='medium'></Button>
      <Button label="Add Offer"  color='red' size='medium'></Button>
      <Button label="Edit Offer"  color='red' size='medium'></Button>
    </div>
  )
}

export default AdminPage
