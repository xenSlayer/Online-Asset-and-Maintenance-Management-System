import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchMaintenanceRecords } from '../api/maintenanceRecords';
import { MonthlyCostChart } from '../components/maintenanceRecords/MonthlyCostChart';
import {
  RecordSearchFilter,
  type AssetFilter,
} from '../components/maintenanceRecords/RecordSearchFilter';
import { RecordsSummaryCards } from '../components/maintenanceRecords/RecordsSummaryCards';
import { RecordsTable } from '../components/maintenanceRecords/RecordsTable';
import { DashboardLayout } from '../layouts/DashboardLayout';
import type { MaintenanceRecord } from '../types/maintenanceRecord';

export function MaintenanceRecordsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [assetFilter, setAssetFilter] = useState<AssetFilter>('All Assets');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [assetNames, setAssetNames] = useState<string[]>([]);
  const [summary, setSummary] = useState({
    totalRecords: 0,
    totalCostYtdDisplay: '$0',
    avgCostDisplay: '$0',
  });
  const [chartData, setChartData] = useState<{ month: string; value: number }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRecords = useCallback(async () => {
    try {
      const data = await fetchMaintenanceRecords();
      setRecords(data.records);
      setAssetNames(data.assetNames);
      setSummary(data.summary);
      setChartData(data.chartData);
      setError('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load maintenance records',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return records.filter((record) => {
      const matchesAsset =
        assetFilter === 'All Assets' || record.assetName === assetFilter;
      const matchesSearch =
        query.length === 0 ||
        record.id.toLowerCase().includes(query) ||
        record.assetName.toLowerCase().includes(query) ||
        record.technician.toLowerCase().includes(query) ||
        record.requestId.toLowerCase().includes(query);
      const matchesFrom = !fromDate || record.isoDate >= fromDate;
      const matchesTo = !toDate || record.isoDate <= toDate;

      return matchesAsset && matchesSearch && matchesFrom && matchesTo;
    });
  }, [records, searchQuery, assetFilter, fromDate, toDate]);

  return (
    <DashboardLayout pageTitle="Maintenance Records">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">
          Maintenance Records
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Complete history of all maintenance activities
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-sm text-slate-500">Loading records…</p>
        </div>
      ) : (
        <>
          <RecordsSummaryCards
            totalRecords={summary.totalRecords}
            totalCostYtdDisplay={summary.totalCostYtdDisplay}
            avgCostDisplay={summary.avgCostDisplay}
          />

          <RecordSearchFilter
            searchQuery={searchQuery}
            assetFilter={assetFilter}
            assetOptions={assetNames}
            fromDate={fromDate}
            toDate={toDate}
            onSearchChange={setSearchQuery}
            onAssetFilterChange={setAssetFilter}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
          />

          <RecordsTable
            records={filteredRecords}
            totalRecords={records.length}
          />

          <MonthlyCostChart chartData={chartData} />
        </>
      )}
    </DashboardLayout>
  );
}
