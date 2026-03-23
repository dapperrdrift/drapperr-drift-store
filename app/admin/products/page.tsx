"use client"

import Link from "next/link"
import Image from "next/image"
import { Plus, Search, MoreVertical, Edit, Trash2, Eye } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data - will be replaced with database queries
const products = [
  {
    id: "1",
    name: "Cashmere Knit Sweater",
    slug: "cashmere-knit-sweater",
    image: "/images/product-1.jpg",
    category: "Knitwear",
    price: 12500,
    variants: 10,
    totalStock: 47,
    isActive: true,
  },
  {
    id: "2",
    name: "Tailored Wool Blazer",
    slug: "tailored-wool-blazer",
    image: "/images/product-2.jpg",
    category: "Outerwear",
    price: 24500,
    variants: 8,
    totalStock: 23,
    isActive: true,
  },
  {
    id: "3",
    name: "Silk Wide-Leg Trousers",
    slug: "silk-wide-leg-trousers",
    image: "/images/product-3.jpg",
    category: "Bottoms",
    price: 8900,
    variants: 6,
    totalStock: 31,
    isActive: true,
  },
  {
    id: "4",
    name: "Artisan Leather Belt",
    slug: "artisan-leather-belt",
    image: "/images/product-4.jpg",
    category: "Accessories",
    price: 4500,
    variants: 4,
    totalStock: 56,
    isActive: true,
  },
  {
    id: "5",
    name: "Premium Cotton Shirt",
    slug: "premium-cotton-shirt",
    image: "/images/product-5.jpg",
    category: "Tops",
    price: 6800,
    variants: 12,
    totalStock: 89,
    isActive: true,
  },
  {
    id: "6",
    name: "Camel Wool Overcoat",
    slug: "camel-wool-overcoat",
    image: "/images/product-6.jpg",
    category: "Outerwear",
    price: 35000,
    variants: 6,
    totalStock: 12,
    isActive: false,
  },
]

export default function AdminProductsPage() {
  return (
    <div>
      <AdminHeader title="Products" />
      
      <main className="p-6">
        {/* Actions bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 border border-border px-3 py-2 bg-surface-container-lowest w-full sm:w-80">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 bg-transparent body-md placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary-hover">
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Products table */}
        <div className="mt-6 bg-surface-container-lowest border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-container-low">
                  <th className="px-4 py-3 text-left label-md text-muted-foreground">Product</th>
                  <th className="px-4 py-3 text-left label-md text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left label-md text-muted-foreground">Price</th>
                  <th className="px-4 py-3 text-left label-md text-muted-foreground">Variants</th>
                  <th className="px-4 py-3 text-left label-md text-muted-foreground">Stock</th>
                  <th className="px-4 py-3 text-left label-md text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right label-md text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 flex-shrink-0 overflow-hidden bg-surface-container-low">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <span className="title-md text-foreground">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="body-md text-muted-foreground">{product.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="body-md text-foreground">Rs. {product.price.toLocaleString("en-IN")}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="body-md text-muted-foreground">{product.variants}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`body-md ${product.totalStock < 20 ? "text-destructive" : "text-foreground"}`}>
                        {product.totalStock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 label-md ${product.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {product.isActive ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/products/${product.slug}`} className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}/edit`} className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="body-md text-muted-foreground">
            Showing 1-{products.length} of {products.length} products
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
