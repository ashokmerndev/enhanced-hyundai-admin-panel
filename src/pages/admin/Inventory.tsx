import { useAdmin } from '@/contexts/AdminContext';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, TrendingDown, Box } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { StatCard } from '@/components/admin/StatCard';

export default function Inventory() {
  const { products, analytics } = useAdmin();

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockItems = products.filter((p) => p.stock < 10);
  const outOfStockItems = products.filter((p) => p.stock === 0);

  const categoryStock = analytics.categoryDistribution.map((cat) => ({
    category: cat.name,
    stock: products
      .filter((p) => p.category === cat.name)
      .reduce((sum, p) => sum + p.stock, 0),
  }));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Inventory Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">Monitor stock levels and inventory health</p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Stock Items"
          value={totalStock}
          icon={Package}
          iconBgColor="bg-primary"
          delay={0}
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStockItems.length}
          icon={AlertTriangle}
          iconBgColor="bg-warning"
          delay={0.1}
        />
        <StatCard
          title="Out of Stock"
          value={outOfStockItems.length}
          icon={TrendingDown}
          iconBgColor="bg-destructive"
          delay={0.2}
        />
        <StatCard
          title="Total Products"
          value={products.length}
          icon={Box}
          iconBgColor="bg-info"
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        {/* Category Stock Levels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Stock by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryStock}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="category" stroke="hsl(var(--foreground))" fontSize={12} angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="stock" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Low Stock Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Low Stock Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="p-3 rounded-lg hover:bg-muted/50 transition-smooth"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.partNumber}</p>
                      </div>
                      <Badge variant={product.stock === 0 ? 'destructive' : 'secondary'}>
                        {product.stock} units
                      </Badge>
                    </div>
                    <Progress
                      value={(product.stock / 50) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Stock Status Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle>Stock Status by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg hover:bg-muted/50 transition-smooth gap-3"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{product.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {product.partNumber} • {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pl-13 sm:pl-0">
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-muted-foreground">Stock</p>
                      <p
                        className={`text-lg font-bold ${
                          product.stock === 0
                            ? 'text-destructive'
                            : product.stock < 10
                            ? 'text-warning'
                            : 'text-success'
                        }`}
                      >
                        {product.stock}
                      </p>
                    </div>
                    <Badge
                      variant={
                        product.stock === 0
                          ? 'destructive'
                          : product.stock < 10
                          ? 'secondary'
                          : 'default'
                      }
                      className={
                        product.stock >= 10 ? 'bg-success text-success-foreground' : ''
                      }
                    >
                      {product.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
