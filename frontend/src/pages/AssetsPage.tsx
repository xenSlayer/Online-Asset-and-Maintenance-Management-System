import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createAsset,
  fetchAsset,
  fetchAssets,
  updateAsset,
} from '../api/assets';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AssetDetail } from '../components/assets/AssetDetail';
import { AssetForm } from '../components/assets/AssetForm';
import {
  AssetSearchFilter,
  type CategoryFilter,
  type StatusFilter,
} from '../components/assets/AssetSearchFilter';
import { AssetTable } from '../components/assets/AssetTable';
import type { Asset, AssetCategory, AssetStatus } from '../types/asset';

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
  const [assetList, setAssetList] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const loadAssets = useCallback(async () => {
    try {
      const assets = await fetchAssets();
      setAssetList(assets);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

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
    setFormError('');
    setFormLoading(false);
    setView('form');
  };

  const openEditForm = async (asset: Asset) => {
    setFormError('');
    setFormLoading(true);
    setView('form');

    try {
      const detail = await fetchAsset(asset.id);
      setEditingAsset(detail);
      setSelectedAsset(detail);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to load asset');
      setView('list');
    } finally {
      setFormLoading(false);
    }
  };

  const openDetail = async (asset: Asset) => {
    setDetailLoading(true);
    setError('');
    setView('detail');

    try {
      const detail = await fetchAsset(asset.id);
      setSelectedAsset(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load asset');
      setView('list');
    } finally {
      setDetailLoading(false);
    }
  };

  const backToList = () => {
    setEditingAsset(null);
    setSelectedAsset(null);
    setFormError('');
    setView('list');
  };

  const handleSave = async (input: {
    name: string;
    category: AssetCategory;
    serialNo: string;
    description: string;
    location: string;
    purchaseDate: string;
    status: AssetStatus;
    assignedTo: string;
  }) => {
    setSaving(true);
    setFormError('');

    try {
      if (editingAsset) {
        await updateAsset(editingAsset.id, input);
      } else {
        await createAsset(input);
      }

      await loadAssets();
      backToList();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save asset');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Asset Management">
      {view === 'list' && (
        <>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <AssetSearchFilter
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            onSearchChange={setSearchQuery}
            onCategoryFilterChange={setCategoryFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Loading assets…
            </div>
          ) : (
            <AssetTable
              assets={filteredAssets}
              totalCount={assetList.length}
              onView={openDetail}
              onEdit={openEditForm}
            />
          )}
        </>
      )}

      {view === 'form' && formLoading && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading asset…
        </div>
      )}

      {view === 'form' && !formLoading && (
        <AssetForm
          key={editingAsset?.id ?? 'new'}
          asset={editingAsset}
          saving={saving}
          error={formError}
          onCancel={backToList}
          onSave={handleSave}
        />
      )}

      {view === 'detail' && detailLoading && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading asset details…
        </div>
      )}

      {view === 'detail' && !detailLoading && selectedAsset && (
        <AssetDetail
          asset={selectedAsset}
          onBack={backToList}
          onEdit={() => openEditForm(selectedAsset)}
        />
      )}
    </DashboardLayout>
  );
}
