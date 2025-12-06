import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconBgColor?: string;
  delay?: number;
}

export function StatCard({ title, value, icon: Icon, trend, iconBgColor = 'bg-primary', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="glass hover:shadow-lg transition-smooth cursor-pointer group">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
              <h3 className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2 truncate">{value}</h3>
              {trend && (
                <p className={`text-xs mt-1 sm:mt-2 ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </p>
              )}
            </div>
            <div
              className={`${iconBgColor} p-2 sm:p-3 rounded-lg group-hover:scale-110 transition-smooth shrink-0`}
            >
              <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
