import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/contexts/StoreContext";
import { Product, TransactionItem } from "@/types/store";
import { ShoppingCart, Plus, Minus, Trash2, User, Filter, Package, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const POSSystem = () => {
  const {
    products,
    customers,
    addTransaction
  } = useStore();
  const {
    toast
  } = useToast();
  const [cart, setCart] = useState<TransactionItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'utang' | 'partial'>('cash');
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Get unique categories from products
  const categories = Array.from(new Set(products.map(product => product.category)));

  // Filter products by selected category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is out of stock!`,
        variant: "destructive"
      });
      return;
    }
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${product.stock} ${product.name} available!`,
          variant: "destructive"
        });
        return;
      }
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem: TransactionItem = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        total: product.price
      };
      setCart([...cart, newItem]);
    }
  };
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.productId !== productId));
      return;
    }
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.stock} ${product.name} available!`,
        variant: "destructive"
      });
      return;
    }
    setCart(cart.map(item => item.productId === productId ? {
      ...item,
      quantity,
      total: item.price * quantity
    } : item));
  };
  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };
  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };
  const getChange = () => {
    const total = getTotalAmount();
    if (paymentMethod === 'cash') {
      return Math.max(0, amountPaid - total);
    }
    return 0;
  };
  const getUtangAmount = () => {
    const total = getTotalAmount();
    if (paymentMethod === 'utang') {
      return total;
    } else if (paymentMethod === 'partial') {
      return Math.max(0, total - amountPaid);
    }
    return 0;
  };
  const processTransaction = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before processing transaction.",
        variant: "destructive"
      });
      return;
    }
    const total = getTotalAmount();
    const utangAmount = getUtangAmount();
    if (paymentMethod !== 'utang' && amountPaid < total - utangAmount) {
      toast({
        title: "Insufficient Payment",
        description: "Payment amount is less than the required amount.",
        variant: "destructive"
      });
      return;
    }
    if ((paymentMethod === 'utang' || paymentMethod === 'partial') && !selectedCustomer) {
      toast({
        title: "Customer Required",
        description: "Please select a customer for utang transactions.",
        variant: "destructive"
      });
      return;
    }
    const customer = customers.find(c => c.id === selectedCustomer);
    const transaction = {
      customerId: selectedCustomer || undefined,
      customerName: customer?.name || undefined,
      items: cart,
      totalAmount: total,
      amountPaid: paymentMethod === 'utang' ? 0 : amountPaid,
      change: getChange(),
      utangAmount: utangAmount,
      paymentMethod,
      status: 'completed' as const
    };
    addTransaction(transaction);

    // Reset form
    setCart([]);
    setSelectedCustomer("");
    setAmountPaid(0);
    setPaymentMethod('cash');
    toast({
      title: "Transaction Completed",
      description: `Sale of ₱${total.toFixed(2)} processed successfully!`
    });
  };
  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 p-2 md:p-0">
      {/* Enhanced Products List */}
      <div className="lg:col-span-2">
        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-orange-900 text-lg md:text-xl">
                  <Package className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
                  Products
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full ml-2">
                    {filteredProducts.length}
                  </span>
                </CardTitle>
              </div>
              
              {/* Enhanced Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 border-orange-200 focus:border-orange-400 focus:ring-orange-200" />
                </div>
                <div className="flex items-center gap-2 sm:min-w-[180px]">
                  <Filter className="h-4 w-4 text-orange-600 flex-shrink-0" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="border-orange-200 focus:border-orange-400 focus:ring-orange-200">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-orange-200">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {filteredProducts.map(product => <Card key={product.id} className={`group cursor-pointer transition-all duration-200 ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50' : 'hover:shadow-md hover:scale-[1.01] border-orange-100 hover:border-orange-300 bg-gradient-to-r from-white to-orange-50/30'}`} onClick={() => addToCart(product)}>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center justify-between gap-3">
                      {/* Product Info - Left Side */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
                            {product.name}
                          </h3>
                          {product.stock > 0 && <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                              <div className="bg-orange-600 text-white rounded-full p-1.5">
                                
                              </div>
                            </div>}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-full">
                            {product.category}
                          </span>
                          <div className={`text-xs font-medium px-2 py-1 rounded-full ${product.stock <= 0 ? 'bg-red-100 text-red-700' : product.stock <= product.minStock ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {product.stock <= 0 ? 'Out of Stock' : `${product.stock} left`}
                          </div>
                        </div>
                      </div>
                      
                      {/* Price - Right Side */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg md:text-xl font-bold text-orange-600">
                          ₱{product.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
              
              {/* Empty State */}
              {filteredProducts.length === 0 && <div className="text-center py-12 px-4">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No products found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {searchQuery ? 'Try adjusting your search terms' : 'No products available in this category'}
                  </p>
                  {(searchQuery || selectedCategory !== "all") && <Button variant="outline" className="mt-4 border-orange-200 text-orange-600 hover:bg-orange-50" onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}>
                      Clear Filters
                    </Button>}
                </div>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart and Checkout - keeping existing code */}
      <div className="space-y-4">
        {/* Cart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <ShoppingCart className="h-5 w-5" />
              Cart ({cart.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? <p className="text-muted-foreground text-sm">Cart is empty</p> : <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.map(item => <div key={item.productId} className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{item.productName}</h4>
                      <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.productId)} className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="h-6 w-6 p-0">
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="h-6 w-6 p-0">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-bold text-orange-600">₱{item.total.toFixed(2)}</span>
                    </div>
                  </div>)}
              </div>}
            
            {cart.length > 0 && <div className="border-t pt-3">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-orange-600">₱{getTotalAmount().toFixed(2)}</span>
                </div>
              </div>}
          </CardContent>
        </Card>

        {/* Checkout */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-900">Checkout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(value: 'cash' | 'utang' | 'partial') => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="utang">Utang (Credit)</SelectItem>
                  <SelectItem value="partial">Partial Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(paymentMethod === 'utang' || paymentMethod === 'partial') && <div>
                <Label htmlFor="customer">Customer</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>}

            {paymentMethod !== 'utang' && <div>
                <Label htmlFor="amount-paid">Amount Paid</Label>
                <Input id="amount-paid" type="number" value={amountPaid} onChange={e => setAmountPaid(Number(e.target.value))} placeholder="0.00" />
              </div>}

            {paymentMethod === 'cash' && amountPaid > 0 && <div className="text-sm">
                <span className="text-muted-foreground">Change: </span>
                <span className="font-bold text-green-600">₱{getChange().toFixed(2)}</span>
              </div>}

            {getUtangAmount() > 0 && <div className="text-sm">
                <span className="text-muted-foreground">Utang Amount: </span>
                <span className="font-bold text-red-600">₱{getUtangAmount().toFixed(2)}</span>
              </div>}

            <Button onClick={processTransaction} className="w-full bg-orange-600 hover:bg-orange-700" disabled={cart.length === 0}>
              Process Transaction
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default POSSystem;