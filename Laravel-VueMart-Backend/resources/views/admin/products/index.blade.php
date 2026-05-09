@extends('layouts.admin')
@section('title', 'Products')

@section('content')
<div class="flex items-center justify-between mb-4">
    <div>
        <div class="text-muted text-sm">{{ $products->total() }} products total</div>
    </div>
    <a href="{{ route('admin.products.create') }}" class="btn btn-primary">
        + Add Product
    </a>
</div>

<!-- Filters -->
<div class="card mb-4">
    <div class="card-body" style="padding:14px 20px">
        <form method="GET" style="display:flex;gap:12px;align-items:center">
            <input type="text" name="search" value="{{ request('search') }}" placeholder="Search products..." class="form-control" style="max-width:280px">
            <select name="category" class="form-control form-select" style="max-width:200px">
                <option value="">All Categories</option>
                @foreach($categories as $cat)
                    <option value="{{ $cat->id }}" {{ request('category') == $cat->id ? 'selected' : '' }}>{{ $cat->name }}</option>
                @endforeach
            </select>
            <button type="submit" class="btn btn-ghost">Filter</button>
            @if(request('search') || request('category'))
                <a href="{{ route('admin.products.index') }}" class="btn btn-ghost">Clear</a>
            @endif
        </form>
    </div>
</div>

<div class="card">
    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @forelse($products as $product)
                <tr>
                    <td>
                        <div style="display:flex;align-items:center;gap:10px">
                            @if($product->image)
                                <img src="{{ asset('storage/'.$product->image) }}" style="width:40px;height:40px;border-radius:8px;object-fit:cover">
                            @else
                                <div style="width:40px;height:40px;border-radius:8px;background:#F3F4F6;display:flex;align-items:center;justify-content:center;font-size:18px">🍽️</div>
                            @endif
                            <div>
                                <div class="font-medium">{{ $product->name }}</div>
                                <div class="text-muted text-sm">{{ $product->unit ?? '' }}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span style="display:inline-flex;align-items:center;gap:4px">
                            {{ $product->category->icon ?? '' }} {{ $product->category->name ?? '—' }}
                        </span>
                    </td>
                    <td>
                        @if($product->sale_price)
                            <div class="font-bold" style="color:var(--brand)">${{ number_format($product->sale_price, 2) }}</div>
                            <div class="text-sm text-muted" style="text-decoration:line-through">${{ number_format($product->price, 2) }}</div>
                        @else
                            <div class="font-bold">${{ number_format($product->price, 2) }}</div>
                        @endif
                    </td>
                    <td>
                        <span class="{{ $product->stock < 10 ? 'badge badge-cancelled' : '' }}">
                            {{ $product->stock }}
                        </span>
                    </td>
                    <td>
                        <span class="badge badge-{{ $product->is_active ? 'active' : 'inactive' }}">
                            {{ $product->is_active ? 'Active' : 'Inactive' }}
                        </span>
                    </td>
                    <td style="text-align:center">
                        {{ $product->is_featured ? '⭐' : '—' }}
                    </td>
                    <td>
                        <div style="display:flex;gap:6px">
                            <a href="{{ route('admin.products.edit', $product) }}" class="btn btn-ghost btn-sm">Edit</a>
                            <form action="{{ route('admin.products.destroy', $product) }}" method="POST" onsubmit="return confirm('Delete this product?')">
                                @csrf @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm">Del</button>
                            </form>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="7" style="text-align:center;padding:48px;color:var(--muted)">
                        No products found
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    @if($products->hasPages())
    <div class="pagination">
        {{ $products->links('pagination::simple-default') }}
    </div>
    @endif
</div>
@endsection
