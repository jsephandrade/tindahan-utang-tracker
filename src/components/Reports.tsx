
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp, Users, Receipt } from "lucide-react";

const Reports = () => {
  const { t } = useTranslation();

  // Mock data for charts
  const monthlyData = [
    { month: "Jan", utang: 12000, payments: 8000 },
    { month: "Feb", utang: 15000, payments: 12000 },
    { month: "Mar", utang: 18000, payments: 15000 },
    { month: "Apr", utang: 22000, payments: 18000 },
    { month: "May", utang: 25000, payments: 20000 },
    { month: "Jun", utang: 28000, payments: 25000 },
  ];

  const customerData = [
    { name: "Regular Customers", value: 60, color: "#ea580c" },
    { name: "Occasional", value: 30, color: "#fb923c" },
    { name: "New", value: 10, color: "#fed7aa" },
  ];

  const stats = [
    {
      title: "Total Outstanding",
      value: "₱45,230",
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Active Customers",
      value: "142",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Monthly Transactions",
      value: "89",
      icon: Receipt,
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Monthly Trends
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₱${value}`, ""]} />
                <Bar dataKey="utang" fill="#ea580c" name="New Utang" />
                <Bar dataKey="payments" fill="#fb923c" name="Payments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {customerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Juan Dela Cruz</p>
                  <p className="text-sm text-gray-500">New purchase</p>
                </div>
                <span className="text-orange-600 font-medium">₱250</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Maria Santos</p>
                  <p className="text-sm text-gray-500">Payment received</p>
                </div>
                <span className="text-green-600 font-medium">₱150</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Pedro Garcia</p>
                  <p className="text-sm text-gray-500">New utang</p>
                </div>
                <span className="text-red-600 font-medium">₱300</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
