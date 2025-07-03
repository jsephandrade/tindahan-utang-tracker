import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStore } from "@/contexts/StoreContext";
import { Product } from "@/types/store";
import { Package, Plus, Edit, Trash2, AlertTriangle, Barcode, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InventoryManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    minStock: 0,
    barcode: "",
    supplier: "",
  });

  const resetForm = () => {
    setProductForm({
      name: "",
      category: "",
      price: 0,
      stock: 0,
      minStock: 0,
      barcode: "",
      supplier: "",
    });
  };

  const handleAddProduct = () => {
    if (!productForm.name || !productForm.category || productForm.price <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields with valid values.",
        variant: "destructive",
      });
      return;
    }

    addProduct(productForm);
    resetForm();
    setIsAddDialogOpen(false);
    
    toast({
      title: "Product Added",
      description: `${productForm.name} has been added to inventory.`,
    });
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;
    
    if (!productForm.name || !productForm.category || productForm.price <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields with valid values.",
        variant: "destructive",
      });
      return;
    }

    updateProduct(editingProduct.id, productForm);
    resetForm();
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    
    toast({
      title: "Product Updated",
      description: `${productForm.name} has been updated.`,
    });
  };

  const handleDeleteProduct = (product: Product) => {
    deleteProduct(product.id);
    toast({
      title: "Product Deleted",
      description: `${product.name} has been removed from inventory.`,
    });
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      barcode: product.barcode || "",
      supplier: product.supplier || "",
    });
    setIsEditDialogOpen(true);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-orange-900">Inventory Management</h2>
          <p className="text-orange-700">Manage your product inventory and stock levels</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  placeholder="Enter category"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minStock">Minimum Stock</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={productForm.minStock}
                    onChange={(e) => setProductForm({ ...productForm, minStock: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={productForm.barcode}
                    onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
                    placeholder="Enter barcode"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={productForm.supplier}
                  onChange={(e) => setProductForm({ ...productForm, supplier: e.target.value })}
                  placeholder="Enter supplier name"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleAddProduct} className="bg-orange-600 hover:bg-orange-700">
                  Add Product
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert ({lowStockProducts.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="bg-white p-3 rounded border border-orange-200">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-red-600">Stock: {product.stock} (Min: {product.minStock})</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Products Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-orange-900" />
          <h3 className="text-lg font-semibold text-orange-900">Products ({filteredProducts.length})</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow border-orange-100 hover:border-orange-200">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Product Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg">{product.name}</h4>
                      <p className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded-full inline-block mt-1">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-orange-900">₱{product.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Stock Information */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Current Stock</span>
                      <span className={`font-bold ${product.stock <= product.minStock ? 'text-red-600' : 'text-green-600'}`}>
                        {product.stock}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Min Stock</span>
                      <span className="text-sm text-gray-700">{product.minStock}</span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2">
                    {product.barcode && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Barcode className="h-4 w-4" />
                        <span>{product.barcode}</span>
                      </div>
                    )}
                    {product.supplier && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{product.supplier}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(product)}
                      className="flex-1 hover:bg-orange-50 hover:border-orange-200"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No products found matching your search.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Product Name *</Label>
              <Input
                id="edit-name"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-category">Category *</Label>
              <Input
                id="edit-category"
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                placeholder="Enter category"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Price *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-minStock">Minimum Stock</Label>
                <Input
                  id="edit-minStock"
                  type="number"
                  value={productForm.minStock}
                  onChange={(e) => setProductForm({ ...productForm, minStock: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-barcode">Barcode</Label>
                <Input
                  id="edit-barcode"
                  value={productForm.barcode}
                  onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
                  placeholder="Enter barcode"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-supplier">Supplier</Label>
              <Input
                id="edit-supplier"
                value={productForm.supplier}
                onChange={(e) => setProductForm({ ...productForm, supplier: e.target.value })}
                placeholder="Enter supplier name"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleEditProduct} className="bg-orange-600 hover:bg-orange-700">
                Update Product
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

export default InventoryManagement;
