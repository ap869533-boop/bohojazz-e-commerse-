import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Upload } from 'lucide-react';
import api, { handleApiError } from '../../utils/api';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', short_description: '', category_id: '',
    price: '', sale_price: '', stock_quantity: '', sku: '',
    fabric: '', care_instructions: '', brand: '', tags: '',
  });
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data?.filter(c => !c.parent_id) || [])).catch(() => {});
    if (isEdit) {
      // Load existing product for editing (simplified - load by id)
      api.get(`/vendor/products?limit=100`).then(r => {
        const prod = r.data.data?.find(p => p.id === parseInt(id));
        if (prod) setForm({ name: prod.name || '', description: '', short_description: '', category_id: prod.category_id || '', price: prod.price || '', sale_price: prod.sale_price || '', stock_quantity: prod.stock_quantity || '', sku: prod.sku || '', fabric: '', care_instructions: '', brand: '', tags: '' });
      }).catch(() => {});
    }
  }, [id]);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const addVariant = () => setVariants(p => [...p, { name: 'Size', value: '', price_modifier: 0, stock_quantity: 0 }]);
  const updateVariant = (i, key, val) => setVariants(p => p.map((v, idx) => idx === i ? { ...v, [key]: val } : v));
  const removeVariant = (i) => setVariants(p => p.filter((_, idx) => idx !== i));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const urls = files.map(f => URL.createObjectURL(f));
    setImages(urls);
  };

  const submit = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required.'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
        stock_quantity: parseInt(form.stock_quantity) || 0,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : null,
        variants: variants.map(v => ({ ...v, price_modifier: parseFloat(v.price_modifier) || 0, stock_quantity: parseInt(v.stock_quantity) || 0 })),
      };

      let result;
      if (isEdit) {
        await api.put(`/vendor/products/${id}`, payload);
        result = { data: { id } };
        toast.success('Product updated! Sent for review.');
      } else {
        const { data } = await api.post('/vendor/products', payload);
        result = data;
        toast.success('Product submitted for review!');
      }

      // Upload images if any
      if (imageFiles.length > 0 && result.data?.id) {
        const formData = new FormData();
        imageFiles.forEach(f => formData.append('images', f));
        formData.append('isPrimary', '1');
        await api.post(`/vendor/products/${result.data.id}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/vendor/products');
    } catch (err) { handleApiError(err); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-sm text-gray-500 font-body">Product will be reviewed before publishing</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="card p-5">
            <h3 className="font-display text-lg mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Product Name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="e.g. Floral Anarkali Kurta" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Short Description</label>
                <input value={form.short_description} onChange={e => set('short_description', e.target.value)}
                  placeholder="Brief one-line description" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Detailed product description..." rows={4}
                  className="input-field resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
                  <select value={form.category_id} onChange={e => set('category_id', e.target.value)} className="input-field">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Brand</label>
                  <input value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Brand name" className="input-field" />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="card p-5">
            <h3 className="font-display text-lg mb-4">Pricing & Stock</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Regular Price (₹) *</label>
                <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
                  placeholder="0.00" min="0" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Sale Price (₹)</label>
                <input type="number" value={form.sale_price} onChange={e => set('sale_price', e.target.value)}
                  placeholder="Optional" min="0" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Stock Quantity</label>
                <input type="number" value={form.stock_quantity} onChange={e => set('stock_quantity', e.target.value)}
                  placeholder="0" min="0" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">SKU</label>
                <input value={form.sku} onChange={e => set('sku', e.target.value)}
                  placeholder="e.g. BJ-KURTA-001" className="input-field" />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="card p-5">
            <h3 className="font-display text-lg mb-4">Product Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Fabric / Material</label>
                <input value={form.fabric} onChange={e => set('fabric', e.target.value)}
                  placeholder="e.g. Cotton, Silk, Georgette" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Care Instructions</label>
                <textarea value={form.care_instructions} onChange={e => set('care_instructions', e.target.value)}
                  placeholder="e.g. Dry clean only, gentle wash..." rows={2}
                  className="input-field resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Tags (comma separated)</label>
                <input value={form.tags} onChange={e => set('tags', e.target.value)}
                  placeholder="e.g. kurta, ethnic, festive, boho" className="input-field" />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg">Variants (Size / Color)</h3>
              <button onClick={addVariant} className="flex items-center gap-1 text-sm text-boho-terra hover:underline">
                <Plus size={15} /> Add Variant
              </button>
            </div>
            {variants.length === 0 ? (
              <div className="text-center py-5 text-sm text-gray-400">
                <p>No variants added. Click "Add Variant" to add sizes or colors.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-4 gap-3 items-end">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Type</label>
                      <select value={v.name} onChange={e => updateVariant(i, 'name', e.target.value)} className="input-field text-sm">
                        <option>Size</option>
                        <option>Color</option>
                        <option>Material</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Value</label>
                      <input value={v.value} onChange={e => updateVariant(i, 'value', e.target.value)}
                        placeholder="e.g. XL, Red" className="input-field text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Stock</label>
                      <input type="number" value={v.stock_quantity} onChange={e => updateVariant(i, 'stock_quantity', e.target.value)}
                        placeholder="0" min="0" className="input-field text-sm" />
                    </div>
                    <button onClick={() => removeVariant(i)} className="p-2.5 text-red-400 hover:bg-red-50 rounded-lg border border-red-100">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Images */}
          <div className="card p-5">
            <h3 className="font-display text-lg mb-4">Product Images</h3>
            <label className="block w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-boho-terra transition-colors">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              <Upload size={28} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click to upload images</p>
              <p className="text-xs text-gray-400 mt-1">Max 5MB per image, JPG/PNG</p>
            </label>
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {images.map((url, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Publish */}
          <div className="card p-5">
            <h3 className="font-display text-lg mb-4">Publish</h3>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
              <p className="text-xs text-amber-700">
                ⏳ Products are reviewed by admin before going live. Usually takes 24-48 hours.
              </p>
            </div>
            <button onClick={submit} disabled={saving}
              className="btn-primary w-full flex items-center justify-center gap-2">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {saving ? 'Saving...' : (isEdit ? 'Update Product' : 'Submit for Review')}
            </button>
            <button onClick={() => navigate('/vendor/products')}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-3">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
