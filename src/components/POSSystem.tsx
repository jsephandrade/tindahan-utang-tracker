
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/contexts/StoreContext";
import { Product, TransactionItem } from "@/types/store";
import { ShoppingCart, Plus, Minus, Trash2, User, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const POSSystem = () => {
  const { products, customers, addTransaction } = useStore();
  const { toast } = useToast();
  
  const [cart, setCart] = useState<TransactionItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'utang' | 'partial'>('cash');
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories from products
  const categories = Array.from(new Set(products.map(product => product.category)));

  // Filter products by selected category
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is out of stock!`,
        variant: "destructive",
      });
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${product.stock} ${product.name} available!`,
          variant: "destructive",
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
        total: product.price,
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
        variant: "destructive",
      });
      return;
    }

    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity, total: item.price * quantity }
        : item
    ));
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
        variant: "destructive",
      });
      return;
    }

    const total = getTotalAmount();
    const utangAmount = getUtangAmount();

    if (paymentMethod !== 'utang' && amountPaid < (total - utangAmount)) {
      toast({
        title: "Insufficient Payment",
        description: "Payment amount is less than the required amount.",
        variant: "destructive",
      });
      return;
    }

    if ((paymentMethod === 'utang' || paymentMethod === 'partial') && !selectedCustomer) {
      toast({
        title: "Customer Required",
        description: "Please select a customer for utang transactions.",
        variant: "destructive",
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
      status: 'completed' as const,
    };

    addTransaction(transaction);

    // Reset form
    setCart([]);
    setSelectedCustomer("");
    setAmountPaid(0);
    setPaymentMethod('cash');

    toast({
      title: "Transaction Completed",
      description: `Sale of ₱${total.toFixed(2)} processed successfully!`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Product Grid */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-orange-900">Products</CardTitle>
              <div className="flex items-center gap-4">
                <Filter className="h-5 w-5 text-orange-600" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    product.stock <= 0 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-orange-50'
                  }`}
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-orange-600">₱{product.price}</span>
                      <span className={`text-xs ${product.stock <= product.minStock ? 'text-red-500' : 'text-green-600'}`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No products found in this category.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart and Checkout */}
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
            {cart.length === 0 ? (
              <p className="text-muted-foreground text-sm">Cart is empty</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.productId} className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{item.productName}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.productId)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-bold text-orange-600">₱{item.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {cart.length > 0 && (
              <div className="border-t pt-3">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-orange-600">₱{getTotalAmount().toFixed(2)}</span>
                </div>
              </div>
            )}
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

            {(paymentMethod === 'utang' || paymentMethod === 'partial') && (
              <div>
                <Label htmlFor="customer">Customer</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {paymentMethod !== 'utang' && (
              <div>
                <Label htmlFor="amount-paid">Amount Paid</Label>
                <Input
                  id="amount-paid"
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
            )}

            {paymentMethod === 'cash' && amountPaid > 0 && (
              <div className="text-sm">
                <span className="text-muted-foreground">Change: </span>
                <span className="font-bold text-green-600">₱{getChange().toFixed(2)}</span>
              </div>
            )}

            {getUtangAmount() > 0 && (
              <div className="text-sm">
                <span className="text-muted-foreground">Utang Amount: </span>
                <span className="font-bold text-red-600">₱{getUtangAmount().toFixed(2)}</span>
              </div>
            )}

            <Button 
              onClick={processTransaction}
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={cart.length === 0}
            >
              Process Transaction
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default POSSystem;
