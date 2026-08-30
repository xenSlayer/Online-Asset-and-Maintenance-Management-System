import { useMemo, useState } from 'react';
import { assets as initialAssets } from '../data/assets';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AssetDetail } from '../components/assets/AssetDetail';
import { AssetForm } from '../components/assets/AssetForm';
import {
  AssetSearchFilter,
  type CategoryFilter,
  type StatusFilter,
} from '../components/assets/AssetSearchFilter';
import { AssetTable } from '../components/assets/AssetTable';
import type { Asset } from '../types/asset';

type View = 'list' | 'form' | 'detail';

export function AssetsPage() {
  const [view, setView] = useState<View>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>('All Categories');
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('All Statuses');
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assetList] = useState(initialAssets);

  const filteredAssets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return assetList.filter((asset) => {
      const matchesCategory =
        categoryFilter === 'All Categories' ||
        asset.category === categoryFilter;
      const matchesStatus =
        statusFilter === 'All Statuses' || asset.status === statusFilter;
      const matchesSearch =
        query.length === 0 ||
        asset.name.toLowerCase().includes(query) ||
        asset.id.toLowerCase().includes(query) ||
        asset.serialNo.toLowerCase().includes(query);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [assetList, categoryFilter, statusFilter, searchQuery]);

  const openAddForm = () => {
    setEditingAsset(null);
    setSelectedAsset(null);
    setView('form');
  };

  const openEditForm = (asset: Asset) => {
    setEditingAsset(asset);
    setSelectedAsset(asset);
    setView('form');
  };

  const openDetail = (asset: Asset) => {
    setSelectedAsset(asset);
    setView('detail');
  };

  const backToList = () => {
    setEditingAsset(null);
    setSelectedAsset(null);
    setView('list');
  };

  return (
    <DashboardLayout pageTitle="Asset Management">
      {view === 'list' && (
        <>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Asset Management
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Track and manage all organisational assets
              </p>
            </div>
            <button
              type="button"
              onClick={openAddForm}
              className="btn-primary-gradient rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
            >
              + Add Asset
            </button>
          </div>

          <AssetSearchFilter
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            onSearchChange={setSearchQuery}
            onCategoryFilterChange={setCategoryFilter}
            onStatusFilterChange={setStatusFilter}
          />

          <AssetTable
            assets={filteredAssets}
            onView={openDetail}
            onEdit={openEditForm}
          />
        </>
      )}

      {view === 'form' && (
        <AssetForm
          asset={editingAsset}
          onCancel={backToList}
          onSave={backToList}
        />
      )}

      {view === 'detail' && selectedAsset && (
        <AssetDetail
          asset={selectedAsset}
          onBack={backToList}
          onEdit={() => openEditForm(selectedAsset)}
        />
      )}
    </DashboardLayout>
  );
}
