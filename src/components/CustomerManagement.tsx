import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStore } from "@/contexts/StoreContext";
import { Customer } from "@/types/store";
import { Users, Plus, Edit, Phone, CreditCard, Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const CustomerManagement = () => {
  const {
    customers,
    addCustomer,
    updateCustomer,
    utangRecords
  } = useStore();
  const {
    toast
  } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: ""
  });
  const resetForm = () => {
    setCustomerForm({
      name: "",
      phone: ""
    });
  };
  const handleAddCustomer = () => {
    if (!customerForm.name.trim()) {
      toast({
        title: "Invalid Input",
        description: "Customer name is required.",
        variant: "destructive"
      });
      return;
    }
    addCustomer({
      ...customerForm,
      address: ""
    });
    resetForm();
    setIsAddDialogOpen(false);
    toast({
      title: "Customer Added",
      description: `${customerForm.name} has been added to customer list.`
    });
  };
  const handleEditCustomer = () => {
    if (!editingCustomer) return;
    if (!customerForm.name.trim()) {
      toast({
        title: "Invalid Input",
        description: "Customer name is required.",
        variant: "destructive"
      });
      return;
    }
    updateCustomer(editingCustomer.id, {
      ...customerForm,
      address: editingCustomer.address || ""
    });
    resetForm();
    setIsEditDialogOpen(false);
    setEditingCustomer(null);
    toast({
      title: "Customer Updated",
      description: `${customerForm.name} has been updated.`
    });
  };
  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setCustomerForm({
      name: customer.name,
      phone: customer.phone || ""
    });
    setIsEditDialogOpen(true);
  };
  const filteredCustomers = customers.filter(customer => customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.phone && customer.phone.includes(searchTerm));
  const getCustomerUtangHistory = (customerId: string) => {
    return utangRecords.filter(record => record.customerId === customerId);
  };
  const getCustomerActiveUtang = (customerId: string) => {
    return utangRecords.filter(record => record.customerId === customerId && record.status !== 'paid').reduce((sum, record) => {
      const totalPaid = record.payments.reduce((pSum, p) => pSum + p.amount, 0);
      return sum + (record.amount - totalPaid);
    }, 0);
  };
  return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Customer Management
            </h2>
            <p className="text-orange-700/80 text-sm">Manage customer information and track their purchase history</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4">
              <DialogHeader>
                <DialogTitle className="text-orange-900">Add New Customer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-orange-800">Customer Name *</Label>
                  <Input id="name" value={customerForm.name} onChange={e => setCustomerForm({
                  ...customerForm,
                  name: e.target.value
                })} placeholder="Enter customer name" className="border-orange-200 focus:border-orange-400" />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-orange-800">Phone Number</Label>
                  <Input id="phone" value={customerForm.phone} onChange={e => setCustomerForm({
                  ...customerForm,
                  phone: e.target.value
                })} placeholder="Enter phone number" className="border-orange-200 focus:border-orange-400" />
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleAddCustomer} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 flex-1">
                    Add Customer
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-orange-200 text-orange-700 hover:bg-orange-50">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <Input placeholder="Search customers by name or phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="border-orange-200 focus:border-orange-400 bg-white/70 backdrop-blur-sm" />
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-orange-100 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-orange-100 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">With Utang</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customers.filter(c => c.totalUtang > 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-orange-100 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">New This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customers.filter(c => {
                    const thisMonth = new Date().getMonth();
                    return c.createdAt.getMonth() === thisMonth;
                  }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers Grid */}
        <div className="space-y-4">
          {filteredCustomers.length === 0 ? <Card className="bg-white/80 backdrop-blur-sm border-orange-100">
              <CardContent className="p-12 text-center">
                <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <p className="text-muted-foreground font-medium">No customers found</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Try adjusting your search terms</p>
              </CardContent>
            </Card> : filteredCustomers.map(customer => {
          const utangHistory = getCustomerUtangHistory(customer.id);
          const activeUtang = getCustomerActiveUtang(customer.id);
          return <Card key={customer.id} className="bg-white/90 backdrop-blur-sm border-orange-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-4 sm:p-6 border-b border-orange-100">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-3 rounded-xl shadow-lg">
                            <Users className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 truncate">{customer.name}</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Since {customer.createdAt.toLocaleDateString()}</span>
                              </div>
                              {customer.phone && <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Phone className="h-4 w-4" />
                                  <span>{customer.phone}</span>
                                </div>}
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(customer)} className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 shadow-sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    
                    {/* Stats Section */}
                    <div className="p-4 sm:p-6">
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Total Utang</p>
                            <p className="">
                              P{customer.totalUtang.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Active Utang</p>
                            <p className="">
                              P{activeUtang.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Records</p>
                            <p className="text-lg font-bold text-blue-600">
                              {utangHistory.length}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Recent Utang History */}
                      {utangHistory.length > 0 && <div>
                          <div className="flex items-center gap-2 mb-3">
                            <CreditCard className="h-4 w-4 text-orange-600" />
                            <h4 className="font-semibold text-gray-900">Recent Transactions</h4>
                          </div>
                          <div className="space-y-2">
                            {utangHistory.slice(0, 3).map(record => {
                      const totalPaid = record.payments.reduce((sum, p) => sum + p.amount, 0);
                      const balance = record.amount - totalPaid;
                      return <div key={record.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
                                  <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900">P{record.amount.toFixed(2)}</span>
                                        <span className="text-xs text-muted-foreground">
                                          • {record.createdAt.toLocaleDateString()}
                                        </span>
                                      </div>
                                      {balance > 0 && <div className="text-sm text-red-600 font-medium">
                                          Balance: P{balance.toFixed(2)}
                                        </div>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${record.status === 'paid' ? 'bg-green-100 text-green-800 border border-green-200' : record.status === 'partial' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                        {record.status.toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                </div>;
                    })}
                            
                            {utangHistory.length > 3 && <div className="text-center pt-2">
                                <span className="text-xs text-muted-foreground bg-gray-100 px-3 py-1 rounded-full">
                                  +{utangHistory.length - 3} more transactions
                                </span>
                              </div>}
                          </div>
                        </div>}
                    </div>
                  </CardContent>
                </Card>;
        })}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="mx-4">
            <DialogHeader>
              <DialogTitle className="text-orange-900">Edit Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name" className="text-orange-800">Customer Name *</Label>
                <Input id="edit-name" value={customerForm.name} onChange={e => setCustomerForm({
                ...customerForm,
                name: e.target.value
              })} placeholder="Enter customer name" className="border-orange-200 focus:border-orange-400" />
              </div>
              
              <div>
                <Label htmlFor="edit-phone" className="text-orange-800">Phone Number</Label>
                <Input id="edit-phone" value={customerForm.phone} onChange={e => setCustomerForm({
                ...customerForm,
                phone: e.target.value
              })} placeholder="Enter phone number" className="border-orange-200 focus:border-orange-400" />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button onClick={handleEditCustomer} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 flex-1">
                  Update Customer
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-orange-200 text-orange-700 hover:bg-orange-50">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>;
};
export default CustomerManagement;