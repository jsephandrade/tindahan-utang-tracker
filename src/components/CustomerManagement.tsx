
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStore } from "@/contexts/StoreContext";
import { Customer } from "@/types/store";
import { Users, Plus, Edit, Phone, MapPin, CreditCard, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CustomerManagement = () => {
  const { customers, addCustomer, updateCustomer, utangRecords } = useStore();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [customerForm, setCustomerForm] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const resetForm = () => {
    setCustomerForm({
      name: "",
      address: "",
      phone: "",
    });
  };

  const handleAddCustomer = () => {
    if (!customerForm.name.trim()) {
      toast({
        title: "Invalid Input",
        description: "Customer name is required.",
        variant: "destructive",
      });
      return;
    }

    addCustomer(customerForm);
    resetForm();
    setIsAddDialogOpen(false);
    
    toast({
      title: "Customer Added",
      description: `${customerForm.name} has been added to customer list.`,
    });
  };

  const handleEditCustomer = () => {
    if (!editingCustomer) return;
    
    if (!customerForm.name.trim()) {
      toast({
        title: "Invalid Input",
        description: "Customer name is required.",
        variant: "destructive",
      });
      return;
    }

    updateCustomer(editingCustomer.id, customerForm);
    resetForm();
    setIsEditDialogOpen(false);
    setEditingCustomer(null);
    
    toast({
      title: "Customer Updated",
      description: `${customerForm.name} has been updated.`,
    });
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setCustomerForm({
      name: customer.name,
      address: customer.address || "",
      phone: customer.phone || "",
    });
    setIsEditDialogOpen(true);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm)) ||
    (customer.address && customer.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getCustomerUtangHistory = (customerId: string) => {
    return utangRecords.filter(record => record.customerId === customerId);
  };

  const getCustomerActiveUtang = (customerId: string) => {
    return utangRecords
      .filter(record => record.customerId === customerId && record.status !== 'paid')
      .reduce((sum, record) => {
        const totalPaid = record.payments.reduce((pSum, p) => pSum + p.amount, 0);
        return sum + (record.amount - totalPaid);
      }, 0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-orange-900">Customer Management</h2>
          <p className="text-orange-700 text-lg">Manage customer information and track their purchase history</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 px-6 py-3 text-lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl">Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Customer Name *</Label>
                <Input
                  id="name"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  placeholder="Enter customer name"
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <Input
                  id="address"
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                  placeholder="Enter address"
                  className="h-11"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddCustomer} className="bg-orange-600 hover:bg-orange-700 flex-1 h-11">
                  Add Customer
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1 h-11">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-12 text-lg"
        />
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-xl">
                <CreditCard className="h-8 w-8 text-red-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Customers with Utang</p>
                <p className="text-3xl font-bold text-gray-900">
                  {customers.filter(c => c.totalUtang > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">New This Month</p>
                <p className="text-3xl font-bold text-gray-900">
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
      <div className="grid gap-6">
        {filteredCustomers.length === 0 ? (
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-12 text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">No customers found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredCustomers.map((customer) => {
            const utangHistory = getCustomerUtangHistory(customer.id);
            const activeUtang = getCustomerActiveUtang(customer.id);
            
            return (
              <Card key={customer.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-1 space-y-6">
                      {/* Customer Header */}
                      <div className="flex items-center gap-4">
                        <div className="bg-orange-100 p-3 rounded-full">
                          <Users className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-gray-900">{customer.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Customer since {customer.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Contact Information */}
                      <div className="space-y-3">
                        {customer.phone && (
                          <div className="flex items-center gap-3 text-gray-600">
                            <div className="bg-gray-100 p-2 rounded-lg">
                              <Phone className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{customer.phone}</span>
                          </div>
                        )}
                        
                        {customer.address && (
                          <div className="flex items-center gap-3 text-gray-600">
                            <div className="bg-gray-100 p-2 rounded-lg">
                              <MapPin className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{customer.address}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Financial Summary */}
                      <div className="grid grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-muted-foreground font-medium mb-2">Total Utang</p>
                          <p className={`text-2xl font-bold ${customer.totalUtang > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            P{customer.totalUtang.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-muted-foreground font-medium mb-2">Active Utang</p>
                          <p className={`text-2xl font-bold ${activeUtang > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            P{activeUtang.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-muted-foreground font-medium mb-2">Utang Records</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {utangHistory.length}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Edit Button */}
                    <div className="ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(customer)}
                        className="h-10 px-4 hover:bg-orange-50 hover:border-orange-300"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                  
                  {/* Recent Utang History */}
                  {utangHistory.length > 0 && (
                    <div className="border-t pt-6 mt-6">
                      <h4 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Recent Utang History
                      </h4>
                      <div className="space-y-3">
                        {utangHistory.slice(0, 3).map((record) => {
                          const totalPaid = record.payments.reduce((sum, p) => sum + p.amount, 0);
                          const balance = record.amount - totalPaid;
                          
                          return (
                            <div key={record.id} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-lg">P{record.amount.toFixed(2)}</span>
                                  <span className="text-muted-foreground">
                                    • {record.createdAt.toLocaleDateString()}
                                  </span>
                                </div>
                                {record.description && (
                                  <p className="text-sm text-gray-600">{record.description}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-right">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  record.status === 'paid' 
                                    ? 'bg-green-100 text-green-800' 
                                    : record.status === 'partial'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {record.status.toUpperCase()}
                                </span>
                                {balance > 0 && (
                                  <span className="text-red-600 font-semibold text-lg">
                                    P{balance.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        
                        {utangHistory.length > 3 && (
                          <div className="text-center py-3">
                            <p className="text-sm text-muted-foreground bg-gray-50 rounded-lg py-2 px-4 inline-block">
                              ... and {utangHistory.length - 3} more records
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl">Edit Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-medium">Customer Name *</Label>
              <Input
                id="edit-name"
                value={customerForm.name}
                onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                placeholder="Enter customer name"
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="text-sm font-medium">Phone Number</Label>
              <Input
                id="edit-phone"
                value={customerForm.phone}
                onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                placeholder="Enter phone number"
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-address" className="text-sm font-medium">Address</Label>
              <Input
                id="edit-address"
                value={customerForm.address}
                onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                placeholder="Enter address"
                className="h-11"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleEditCustomer} className="bg-orange-600 hover:bg-orange-700 flex-1 h-11">
                Update Customer
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1 h-11">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;
