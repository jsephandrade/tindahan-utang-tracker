
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-orange-900">Customer Management</h2>
          <p className="text-orange-700">Manage customer information and track their purchase history</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Customer Name *</Label>
                <Input
                  id="name"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                  placeholder="Enter address"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleAddCustomer} className="bg-orange-600 hover:bg-orange-700">
                  Add Customer
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
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
        />
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Customers with Utang</p>
                <p className="text-2xl font-bold">
                  {customers.filter(c => c.totalUtang > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">New This Month</p>
                <p className="text-2xl font-bold">
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
      <div className="grid gap-4">
        {filteredCustomers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No customers found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredCustomers.map((customer) => {
            const utangHistory = getCustomerUtangHistory(customer.id);
            const activeUtang = getCustomerActiveUtang(customer.id);
            
            return (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-orange-100 p-2 rounded-full">
                          <Users className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{customer.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Customer since {customer.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            {customer.phone}
                          </div>
                        )}
                        
                        {customer.address && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {customer.address}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Utang</p>
                          <p className={`text-lg font-bold ${customer.totalUtang > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ₱{customer.totalUtang.toFixed(2)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Active Utang</p>
                          <p className={`text-lg font-bold ${activeUtang > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ₱{activeUtang.toFixed(2)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Utang Records</p>
                          <p className="text-lg font-bold text-blue-600">
                            {utangHistory.length}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(customer)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                  
                  {/* Recent Utang History */}
                  {utangHistory.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold mb-2 text-sm">Recent Utang History</h4>
                      <div className="space-y-1">
                        {utangHistory.slice(0, 3).map((record) => {
                          const totalPaid = record.payments.reduce((sum, p) => sum + p.amount, 0);
                          const balance = record.amount - totalPaid;
                          
                          return (
                            <div key={record.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                              <div>
                                <span className="font-medium">₱{record.amount.toFixed(2)}</span>
                                <span className="text-muted-foreground ml-2">
                                  - {record.createdAt.toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  record.status === 'paid' 
                                    ? 'bg-green-100 text-green-800' 
                                    : record.status === 'partial'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {record.status.toUpperCase()}
                                </span>
                                {balance > 0 && (
                                  <span className="text-red-600 font-medium">
                                    ₱{balance.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        
                        {utangHistory.length > 3 && (
                          <p className="text-xs text-muted-foreground text-center mt-2">
                            ... and {utangHistory.length - 3} more records
                          </p>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Customer Name *</Label>
              <Input
                id="edit-name"
                value={customerForm.name}
                onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                placeholder="Enter customer name"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={customerForm.phone}
                onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={customerForm.address}
                onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                placeholder="Enter address"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleEditCustomer} className="bg-orange-600 hover:bg-orange-700">
                Update Customer
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
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
