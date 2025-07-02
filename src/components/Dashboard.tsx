import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/contexts/StoreContext";
import { 
  TrendingUp, 
  CreditCard, 
  AlertTriangle, 
  Users,
  ShoppingBag
} from "lucide-react";

const Dashboard = () => {
  const { getDashboardStats, products, utangRecords } = useStore();
  const stats = getDashboardStats();

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const recentUtang = utangRecords
    .filter(r => r.status === 'unpaid')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{stats.dailySales.toFixed(2)}</div>
            <p className="text-xs text-green-100">
              Total Sales: ₱{stats.totalSales.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utang</CardTitle>
            <CreditCard className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{stats.totalUtang.toFixed(2)}</div>
            <p className="text-xs text-red-100">
              This Month: ₱{stats.monthlyUtang.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockItems}</div>
            <p className="text-xs text-orange-100">
              Items need restocking
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-blue-100">
              Registered customers
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-muted-foreground">All products are well stocked!</p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-orange-900">{product.name}</p>
                      <p className="text-sm text-orange-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">{product.stock} left</p>
                      <p className="text-xs text-muted-foreground">Min: {product.minStock}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Utang */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <CreditCard className="h-5 w-5" />
              Recent Unpaid Utang
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentUtang.length === 0 ? (
              <p className="text-muted-foreground">No unpaid utang records!</p>
            ) : (
              <div className="space-y-3">
                {recentUtang.map((record) => (
                  <div key={record.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-red-900">{record.customerName}</p>
                      <p className="text-sm text-red-600 truncate max-w-[200px]">{record.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">₱{record.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
