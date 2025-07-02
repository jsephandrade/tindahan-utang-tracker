
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStore } from "@/contexts/StoreContext";
import { Product } from "@/types/store";
import { Package, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
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

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-900">
            <Package className="h-5 w-5" />
            Products ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Product</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Stock</th>
                  <th className="text-left p-3">Min Stock</th>
                  <th className="text-left p-3">Supplier</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-orange-50">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.barcode && (
                          <p className="text-xs text-muted-foreground">{product.barcode}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3">₱{product.price.toFixed(2)}</td>
                    <td className="p-3">
                      <span className={product.stock <= product.minStock ? 'text-red-600 font-bold' : ''}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-3">{product.minStock}</td>
                    <td className="p-3">{product.supplier || '-'}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
