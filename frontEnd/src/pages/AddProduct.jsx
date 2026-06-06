import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.jsx'
import { Input } from '../components/Input.jsx'
import { get, getErrorMessage } from '../services/api.js'
import { createProduct } from '../services/productService.js'

const initialForm = {
  name: '',
  category: '',
  unit_price: '',
  initial_quantity: '',
  image: null,
}

function validate(values) {
  /** @type {Record<string, string>} */
  const errors = {}
  const name = values.name.trim()
  if (!name) errors.name = 'Name is required.'
  else if (name.length < 2) errors.name = 'Name must be at least 2 characters.'

  if (!values.category) errors.category = 'Category is required.'

  const priceRaw = values.unit_price.trim()
  if (!priceRaw) errors.price = 'Price is required.'
  else {
    const price = Number(priceRaw)
    if (Number.isNaN(price) || price < 0) errors.price = 'Enter a valid price (0 or more).'
  }

  const quantityRaw = values.initial_quantity.trim()
  if (!quantityRaw) errors.initial_quantity = 'Initial quantity is required.'
  else {
    const quantity = Number(quantityRaw)
    if (Number.isNaN(quantity) || quantity < 0 || !Number.isInteger(quantity)) {
      errors.initial_quantity = 'Enter a whole number 0 or greater.'
    }
  }

  return errors
}

export function AddProduct() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    get('categories/')
      .then((response) => setCategories(Array.isArray(response.data) ? response.data : []))
      .catch(() => setCategories([]))
  }, [])

  function handleChange(field) {
    return (e) => {
      const { value } = e.target
      setForm((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
      setSubmitError(null)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setSubmitError(null)
    try {
      const payload = {
        name: form.name.trim(),
        category: Number(form.category),
        unit_price: form.unit_price.trim(),
        initial_quantity: form.initial_quantity.trim(),
        initial_price: form.unit_price.trim(),
      }
      const formData = new FormData()
      Object.entries(payload).forEach(([k, v]) => formData.append(k, v))
      if (form.image) formData.append('image', form.image)

      const created = await createProduct(formData)
      const newId = created?.product_id ?? created?.id ?? created?.pk
      if (newId != null) navigate(`/products/${newId}`)
      else navigate('/products')
    } catch (err) {
      setSubmitError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Link
        to="/products"
        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
      >
        ← Back to products
      </Link>

      <h1 className="mt-6 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">Add product</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Admin creates product with unit price, initial stock quantity, and optional image.
      </p>

      {submitError ? (
        <div
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {submitError}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <Input
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange('name')}
          error={errors.name}
          required
          autoComplete="off"
        />
        <label className="block text-sm">
          <span className="mb-1 block text-slate-700 dark:text-slate-300">Category</span>
          <select
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            value={form.category}
            onChange={handleChange('category')}
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category ? <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p> : null}
        </label>
        <Input
          label="Unit Price"
          name="unit_price"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          value={form.unit_price}
          onChange={handleChange('unit_price')}
          error={errors.price}
          required
        />
        <Input
          label="Initial Quantity"
          name="initial_quantity"
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          value={form.initial_quantity}
          onChange={handleChange('initial_quantity')}
          error={errors.initial_quantity}
          required
        />
        <Input
          label="Product Image"
          name="image"
          type="file"
          onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.files?.[0] || null }))}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? 'Saving…' : 'Create product'}
          </Button>
          <Link to="/products" className="w-full sm:w-auto">
            <Button variant="outline" type="button" className="w-full" disabled={submitting}>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
