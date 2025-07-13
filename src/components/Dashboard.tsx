
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/contexts/StoreContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  TrendingUp, 
  CreditCard, 
  AlertTriangle, 
  Users,
  ShoppingBag,
  ArrowUp,
  ArrowDown,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const { getDashboardStats, products, utangRecords } = useStore();
  const { t } = useLanguage();
  const stats = getDashboardStats();

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const recentUtang = utangRecords
    .filter(r => r.status === 'unpaid')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const statCards = [
    {
      title: t('dashboard.todaysSales'),
      value: `₱${stats.dailySales.toFixed(2)}`,
      subtitle: `${t('dashboard.totalSales')}: ₱${stats.totalSales.toFixed(2)}`,
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50",
      iconBg: "bg-green-100",
      trend: "+12%",
      trendUp: true
    },
    {
      title: t('dashboard.totalUtang'),
      value: `₱${stats.totalUtang.toFixed(2)}`,
      subtitle: `${t('dashboard.monthlyUtang')}: ₱${stats.monthlyUtang.toFixed(2)}`,
      icon: CreditCard,
      gradient: "from-red-500 to-rose-600",
      bgGradient: "from-red-50 to-rose-50",
      iconBg: "bg-red-100",
      trend: "-5%",
      trendUp: false
    },
    {
      title: t('dashboard.lowStockItems'),
      value: stats.lowStockItems.toString(),
      subtitle: t('dashboard.needRestocking'),
      icon: AlertTriangle,
      gradient: "from-orange-500 to-amber-600",
      bgGradient: "from-orange-50 to-amber-50",
      iconBg: "bg-orange-100",
      trend: "+3",
      trendUp: false
    },
    {
      title: t('dashboard.customers'),
      value: stats.totalCustomers.toString(),
      subtitle: t('dashboard.registeredCustomers'),
      icon: Users,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50", 
      iconBg: "bg-blue-100",
      trend: "+8",
      trendUp: true
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, index) => (
          <Card 
            key={stat.title}
            className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br ${stat.bgGradient}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
              <div className={`w-full h-full rounded-full bg-gradient-to-br ${stat.gradient} transform translate-x-6 -translate-y-6`}></div>
            </div>
            
            <CardContent className="p-4 sm:p-6 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 sm:p-3 rounded-xl ${stat.iconBg}`}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.trendUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {stat.trend}
                </div>
              </div>
              
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Low Stock Products */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <div className="p-2 rounded-lg bg-orange-100">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <span className="text-base sm:text-lg">Low Stock Alert</span>
                <p className="text-xs text-gray-500 font-normal mt-1">Items requiring immediate attention</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-gray-500 text-sm">All products are well stocked! 🎉</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {lowStockProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="group flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-l-4 border-orange-400 hover:shadow-md transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base truncate group-hover:text-orange-700 transition-colors">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                          {product.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          Min: {product.minStock}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="font-bold text-red-600 text-sm sm:text-base">
                          {product.stock} left
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Recent Utang */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <div className="p-2 rounded-lg bg-red-100">
                <CreditCard className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <span className="text-base sm:text-lg">Recent Unpaid Utang</span>
                <p className="text-xs text-gray-500 font-normal mt-1">Latest credit transactions</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUtang.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-gray-500 text-sm">No unpaid utang records! 💰</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentUtang.map((record, index) => (
                  <div 
                    key={record.id} 
                    className="group flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border-l-4 border-red-400 hover:shadow-md transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base truncate group-hover:text-red-700 transition-colors">
                        {record.customerName}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate mt-1">
                        {record.description}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {record.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="font-bold text-red-600 text-sm sm:text-base">
                          ₱{record.amount.toFixed(2)}
                        </span>
                      </div>
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
