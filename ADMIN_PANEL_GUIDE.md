# Hyundai Spares Admin Panel - Developer Guide

A comprehensive guide to understand, modify, and extend the Hyundai Spares E-Commerce Admin Panel.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/                    # Admin-specific components
│   │   ├── AdminHeader.tsx       # Top navigation bar
│   │   ├── AdminSidebar.tsx      # Side navigation menu
│   │   ├── ProductImageGallery.tsx # Multi-image gallery component
│   │   └── StatCard.tsx          # Dashboard statistics card
│   └── ui/                       # Reusable UI components (shadcn/ui)
├── contexts/
│   └── AdminContext.tsx          # Global state management
├── data/                         # Mock JSON data files
│   ├── mockProducts.json         # Product catalog
│   ├── mockOrders.json           # Order records
│   ├── mockCustomers.json        # Customer data
│   ├── mockChats.json            # Support chat history
│   └── mockAnalytics.json        # Sales analytics
├── pages/
│   ├── admin/                    # Admin panel pages
│   │   ├── AdminLayout.tsx       # Main layout wrapper
│   │   ├── Dashboard.tsx         # Overview dashboard
│   │   ├── Products.tsx          # Product management
│   │   ├── Orders.tsx            # Order management
│   │   ├── Customers.tsx         # Customer management
│   │   ├── Inventory.tsx         # Stock management
│   │   ├── Support.tsx           # Customer support chat
│   │   ├── Analytics.tsx         # Sales analytics
│   │   └── Settings.tsx          # Admin settings
│   └── auth/                     # Authentication pages
│       ├── Login.tsx             # Login page
│       └── ForgotPassword.tsx    # Password recovery
├── App.tsx                       # Main app with routing
├── index.css                     # Global styles & design tokens
└── main.tsx                      # Entry point
```

---

## 🎨 Design System

### Color Tokens (index.css)

The app uses HSL color variables for theming. Modify these in `src/index.css`:

```css
:root {
  --primary: 210 100% 45%;        /* Hyundai Blue */
  --secondary: 210 15% 90%;       /* Silver */
  --accent: 210 100% 55%;         /* Light Blue */
  --success: 142 76% 36%;         /* Green */
  --warning: 38 92% 50%;          /* Orange */
  --info: 199 89% 48%;            /* Sky Blue */
}

.dark {
  --primary: 210 100% 50%;        /* Dark mode primary */
  /* ... other dark mode colors */
}
```

### Tailwind Config (tailwind.config.ts)

Custom colors are mapped in `tailwind.config.ts`:

```typescript
colors: {
  primary: 'hsl(var(--primary))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  // Add custom colors here
}
```

---

## 📊 Data Management

### Adding/Modifying Mock Data

#### Products (src/data/mockProducts.json)

```json
{
  "id": "HYD001",
  "name": "Product Name",
  "partNumber": "58101-C8A00",
  "category": "Brake System",
  "price": 2499,
  "stock": 45,
  "model": "i20 Elite (2014-2020)",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "description": "Product description",
  "supplier": "Hyundai Genuine Parts",
  "status": "In Stock"
}
```

**Categories Available:**
- Engine Parts
- Brake System
- Suspension
- Electrical Parts
- Body Parts
- Accessories

**Status Options:**
- "In Stock"
- "Low Stock"
- "Out of Stock"

#### Orders (src/data/mockOrders.json)

```json
{
  "id": "ORD001",
  "customer": "Customer Name",
  "email": "customer@email.com",
  "items": [
    {
      "name": "Product Name",
      "quantity": 1,
      "price": 2499,
      "image": "https://example.com/image.jpg"
    }
  ],
  "total": 2499,
  "status": "Pending",
  "date": "2024-01-15",
  "address": "Full Address"
}
```

**Order Status Options:**
- "Pending"
- "Processing"
- "Shipped"
- "Delivered"

#### Customers (src/data/mockCustomers.json)

```json
{
  "id": "CUST001",
  "name": "Customer Name",
  "email": "email@example.com",
  "phone": "+91 98765 43210",
  "totalOrders": 5,
  "totalSpent": 15000,
  "joinDate": "2024-01-01",
  "avatar": "https://example.com/avatar.jpg"
}
```

---

## 🔧 State Management

### Using AdminContext

The `AdminContext` provides global state for all admin data.

#### Available Data & Functions:

```typescript
const {
  products,           // Product[] - All products
  orders,             // Order[] - All orders
  customers,          // Customer[] - All customers
  chats,              // Chat[] - Support conversations
  analytics,          // Analytics data
  addProduct,         // (product: Product) => void
  updateProduct,      // (id: string, updates: Partial<Product>) => void
  deleteProduct,      // (id: string) => void
  updateOrderStatus,  // (id: string, status: string) => void
} = useAdmin();
```

#### Usage Example:

```tsx
import { useAdmin } from '@/contexts/AdminContext';

function MyComponent() {
  const { products, deleteProduct } = useAdmin();
  
  const handleDelete = (id: string) => {
    deleteProduct(id);
  };
  
  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>{p.name}</li>
      ))
    </ul>
  );
}
```

---

## 🖼️ Image Gallery Component

### ProductImageGallery Usage

```tsx
import { ProductImageGallery } from '@/components/admin/ProductImageGallery';

<ProductImageGallery 
  images={['url1.jpg', 'url2.jpg', 'url3.jpg']}
  productName="Product Name"
/>
```

**Features:**
- Thumbnail preview with stacked images
- Click to open lightbox
- Navigation arrows
- Image counter
- Error fallback handling

---

## 📱 Adding New Pages

### 1. Create the Page Component

```tsx
// src/pages/admin/NewPage.tsx
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold">New Page</h1>
      <Card className="glass">
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Your content here */}
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

### 2. Add Route in App.tsx

```tsx
import NewPage from '@/pages/admin/NewPage';

// Inside Routes
<Route path="new-page" element={<NewPage />} />
```

### 3. Add Sidebar Link

In `src/components/admin/AdminSidebar.tsx`, add to `navItems`:

```tsx
const navItems = [
  // ... existing items
  { icon: YourIcon, label: 'New Page', path: '/admin/new-page' },
];
```

---

## 🎭 Animations

### Using Framer Motion

```tsx
import { motion } from 'framer-motion';

// Fade in animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  Content
</motion.div>

// Stagger children
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## 💰 Price Formatting

Use Indian Rupee format throughout:

```typescript
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Output: ₹2,499
```

---

## 🔐 Authentication (Mock)

Current implementation uses mock authentication. To integrate real auth:

1. Replace mock logic in `src/pages/auth/Login.tsx`
2. Add auth context or use a library (e.g., Firebase, Supabase)
3. Protect routes in `App.tsx`

---

## 📤 File Uploads (Support Chat)

The Support page includes file attachment functionality:

**Supported File Types:**
- Images: .jpg, .jpeg, .png, .gif, .webp
- Documents: .pdf, .doc, .docx, .xls, .xlsx
- Audio: .mp3, .wav, .ogg
- Video: .mp4, .webm
- Archives: .zip, .rar

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔄 Connecting to Real Backend

To replace mock data with a real API:

### 1. Create API Service

```typescript
// src/services/api.ts
const API_BASE = 'https://your-api.com';

export const productApi = {
  getAll: () => fetch(`${API_BASE}/products`).then(r => r.json()),
  create: (data) => fetch(`${API_BASE}/products`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE'
  }),
};
```

### 2. Update AdminContext

```typescript
// Replace useState with useQuery (TanStack Query)
import { useQuery, useMutation } from '@tanstack/react-query';
import { productApi } from '@/services/api';

const { data: products } = useQuery({
  queryKey: ['products'],
  queryFn: productApi.getAll
});
```

---

## 📝 Key Files Reference

| File | Purpose |
|------|---------|
| `src/App.tsx` | Routing configuration |
| `src/index.css` | Design tokens & global styles |
| `tailwind.config.ts` | Tailwind customization |
| `src/contexts/AdminContext.tsx` | Global state |
| `src/components/admin/AdminSidebar.tsx` | Navigation menu |
| `src/data/*.json` | Mock data files |

---

## 🎯 Quick Customization Tips

1. **Change Theme Colors**: Edit HSL values in `src/index.css`
2. **Add New Category**: Update `mockProducts.json` with new category
3. **Modify Navigation**: Edit `navItems` in `AdminSidebar.tsx`
4. **Add Dashboard Stat**: Use `StatCard` component in `Dashboard.tsx`
5. **Change Currency**: Update `formatCurrency` function locale

---

## 📞 Support

For questions or issues, refer to:
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [shadcn/ui](https://ui.shadcn.com)
