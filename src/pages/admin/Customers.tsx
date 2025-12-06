import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function Customers() {
  const { customers } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">View and manage customer information</p>
      </div>

      {/* Search */}
      <Card className="glass">
        <CardContent className="p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="glass hover:shadow-lg transition-smooth cursor-pointer group">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm sm:text-base">
                        {customer.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-smooth truncate">
                        {customer.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{customer.id}</p>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      "text-xs shrink-0",
                      customer.status === 'VIP'
                        ? 'bg-warning text-warning-foreground'
                        : 'bg-success text-success-foreground'
                    )}
                  >
                    {customer.status}
                  </Badge>
                </div>

                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground truncate">{customer.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 sm:pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                    <p className="text-base sm:text-lg font-bold">{customer.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                    <p className="text-base sm:text-lg font-bold text-primary">
                      {formatCurrency(customer.totalSpent)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Customer since {new Date(customer.joinDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredCustomers.length} of {customers.length} customers
      </p>
    </div>
  );
}
