"use client";

import { useState, useEffect } from "react";
import { Pencil, Loader2, DollarSign } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  available: boolean;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export default function MenuPrices() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(true);

  // Fetch menu items
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/menu-prices");

      if (!response.ok) {
        throw new Error("Failed to fetch menu items");
      }

      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Failed to load menu items", {
        description: "Please try refreshing the page.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setPrice(item.price.toString());
    setAvailable(item.available);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
    setPrice("");
    setAvailable(true);
  };

  const handleSubmit = async () => {
    if (!selectedItem) return;

    const priceValue = parseFloat(price);

    if (isNaN(priceValue) || priceValue < 0) {
      toast.error("Invalid price", {
        description: "Please enter a valid price greater than or equal to 0.",
      });
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`/api/menu-prices/${selectedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: priceValue,
          available: available,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update menu item");
      }

      await fetchMenuItems();
      handleCloseDialog();

      toast.success("Menu item updated!", {
        description: `${selectedItem.name} has been updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating menu item:", error);
      toast.error("Failed to update menu item", {
        description: "Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center gap-3 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-3 sm:px-5 w-full">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Menu Management
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground text-sm font-medium">
                  Menu Prices
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Menu Prices</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Update prices and availability for your menu items
            </p>
          </div>

          {/* Menu Items Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground text-sm">
                Loading menu items...
              </p>
            </div>
          ) : menuItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No menu items found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Menu items will appear here once they are added to the
                    system
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[35%]">Item Name</TableHead>
                        <TableHead className="w-[35%] hidden sm:table-cell">
                          Description
                        </TableHead>
                        <TableHead className="w-[10%] text-center">
                          Available
                        </TableHead>
                        <TableHead className="w-[15%] text-right">
                          Price
                        </TableHead>
                        <TableHead className="w-[5%] text-right">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menuItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground">
                            {item.description || "—"}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={item.available}
                                className="data-[state=checked]:bg-lime-600 data-[state=checked]:border-lime-600"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-primary">
                            ${item.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                              onClick={() => handleOpenDialog(item)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Price Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update the price and availability for {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                value={selectedItem?.name || ""}
                disabled
                className="bg-muted"
              />
            </div>

            {selectedItem?.description && (
              <div className="space-y-2">
                <Label htmlFor="item-description">Description</Label>
                <Input
                  id="item-description"
                  value={selectedItem.description}
                  disabled
                  className="bg-muted"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="price">
                Price <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-7"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={available}
                  onCheckedChange={(checked) =>
                    setAvailable(checked as boolean)
                  }
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor="available"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Item is available for ordering
                </Label>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                Uncheck to temporarily remove this item from the menu
              </p>
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Current Price:
                </span>
                <span className="text-lg font-bold text-foreground">
                  ${selectedItem?.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Current Status:
                </span>
                <span
                  className={`text-sm font-semibold ${
                    selectedItem?.available
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {selectedItem?.available ? "Available" : "Unavailable"}
                </span>
              </div>
              {(price && !isNaN(parseFloat(price))) ||
              available !== selectedItem?.available ? (
                <div className="pt-2 border-t border-border space-y-2">
                  {price &&
                    !isNaN(parseFloat(price)) &&
                    parseFloat(price) !== selectedItem?.price && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          New Price:
                        </span>
                        <span className="text-lg font-bold text-primary">
                          ${parseFloat(price).toFixed(2)}
                        </span>
                      </div>
                    )}
                  {available !== selectedItem?.available && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        New Status:
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          available ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        {available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseDialog}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Item"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
