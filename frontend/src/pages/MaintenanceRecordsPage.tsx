import { useMemo, useState } from 'react';
import { maintenanceRecords as initialRecords } from '../data/maintenanceRecords';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { MonthlyCostChart } from '../components/maintenanceRecords/MonthlyCostChart';
import {
  RecordSearchFilter,
  type AssetFilter,
} from '../components/maintenanceRecords/RecordSearchFilter';
import { RecordsSummaryCards } from '../components/maintenanceRecords/RecordsSummaryCards';
import { RecordsTable } from '../components/maintenanceRecords/RecordsTable';

export function MaintenanceRecordsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [assetFilter, setAssetFilter] = useState<AssetFilter>('All Assets');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [records] = useState(initialRecords);

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
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Maintenance Records
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Complete history of all maintenance activities
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Export PDF
        </button>
      </div>

      <RecordsSummaryCards />

      <RecordSearchFilter
        searchQuery={searchQuery}
        assetFilter={assetFilter}
        fromDate={fromDate}
        toDate={toDate}
        onSearchChange={setSearchQuery}
        onAssetFilterChange={setAssetFilter}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      <RecordsTable records={filteredRecords} />

      <MonthlyCostChart />
    </DashboardLayout>
  );
}
