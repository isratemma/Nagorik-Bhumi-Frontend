'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const statusStyle = { Unpaid:'bg-red-100 text-red-600', Paid:'bg-green-100 text-green-700', Overdue:'bg-orange-100 text-orange-600' };

export default function LandTaxPage() {
  const { t } = useLanguage();
  const { token } = useUser();
  const [taxes, setTaxes]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState([]);
  const [paying, setPaying]           = useState(null);

  useEffect(() => {
    const fetchTaxes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/land-tax?limit=100`);
        const data = await res.json();
        if (res.ok) {
          setTaxes(data.taxes || []);
        } else {
          toast.error(data.message || 'Could not load tax records');
        }
      } catch {
        toast.error('Could not connect to server. Make sure backend is running on port 5000.');
      } finally {
        setLoading(false);
      }
    };
    fetchTaxes();
  }, []);

  const totalDue  = taxes.filter(tx => tx.status === 'Unpaid' || tx.status === 'Overdue').reduce((s, tx) => s + tx.amount, 0);
  const totalPaid = taxes.filter(tx => tx.status === 'Paid').reduce((s, tx) => s + tx.amount, 0);
  const nextDue   = taxes
    .filter(tx => tx.status !== 'Paid' && tx.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0]?.dueDate;

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const payTax = async (ids) => {
    const idList = Array.isArray(ids) ? ids : [ids];
    setPaying(idList[0]);
    try {
      await Promise.all(idList.map(id =>
        fetch(`${API}/land-tax/${id}/pay`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ paymentMethod: 'Online' }),
        })
      ));
      // Refresh from server
      const res = await fetch(`${API}/land-tax?limit=100`);
      const data = await res.json();
      if (res.ok) setTaxes(data.taxes || []);
      setSelected([]);
      const paidAmount = taxes.filter(tx => idList.includes(tx._id) && (tx.status === 'Unpaid' || tx.status === 'Overdue')).reduce((s, tx) => s + tx.amount, 0);
      toast.success(`Payment successful! ৳ ${paidAmount.toLocaleString()} paid.`);
    } catch {
      toast.error('Payment failed. Could not connect to server.');
    } finally {
      setPaying(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const downloadReceipt = (tax) => {
    toast.success(`${t.receipt} for ${tax.taxId} downloaded.`);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-full animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"/>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_,i) => <div key={i} className="h-24 bg-gray-200 rounded-xl"/>)}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 h-64"/>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t.landTax}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t.taxSubtitle}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">{t.totalDue}</p>
          <p className="text-2xl font-bold text-red-600 mt-1">৳ {totalDue.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">{taxes.filter(tx => tx.status !== 'Paid').length} properties unpaid</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-xs text-gray-500">{t.totalPaid}</p>
          <p className="text-2xl font-bold text-green-600 mt-1">৳ {totalPaid.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">{taxes.filter(tx => tx.status === 'Paid').length} properties cleared</p>
        </div>
        <div className="bg-brand-light border border-brand/10 rounded-xl p-4">
          <p className="text-xs text-gray-500">{t.nextDueDate}</p>
          <p className="text-2xl font-bold text-brand mt-1">{nextDue ? formatDate(nextDue) : '—'}</p>
          <p className="text-xs text-gray-400 mt-1">Annual land tax deadline</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 text-sm">{t.taxRecords}</h2>
          {selected.length > 0 && (
            <button
              onClick={() => payTax(selected)}
              disabled={paying !== null}
              className="bg-brand hover:bg-brand-dark text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2">
              {paying !== null
                ? <><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>{t.processing}</>
                : `${t.paySelected} (${selected.length})`}
            </button>
          )}
        </div>

        {taxes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400">No tax records found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 w-10"/>
                {['Land Record','Location','Tax ID','Year','Amount','Due Date','Status','Action'].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {taxes.map((tax, i) => {
                const unpaid = tax.status === 'Unpaid' || tax.status === 'Overdue';
                return (
                  <tr key={tax._id || i} className={`hover:bg-gray-50 transition-colors ${selected.includes(tax._id) ? 'bg-brand-light/30' : ''}`}>
                    <td className="px-4 py-3">
                      {unpaid && (
                        <input type="checkbox" checked={selected.includes(tax._id)} onChange={() => toggle(tax._id)}
                          className="w-4 h-4 accent-brand cursor-pointer"/>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700 text-xs">
                      {tax.landRecord?.title || tax.landRecord?.recordId || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {tax.landRecord?.location?.district
                        ? `${tax.landRecord.location.district}${tax.landRecord.location.division ? ', ' + tax.landRecord.location.division : ''}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-brand font-medium text-xs">{tax.taxId}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{tax.year}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800 text-xs">৳ {tax.amount?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(tax.dueDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusStyle[tax.status] || 'bg-gray-100 text-gray-600'}`}>
                        {tax.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {unpaid
                        ? <button
                            onClick={() => payTax([tax._id])}
                            disabled={paying !== null}
                            className="text-xs bg-brand text-white px-3 py-1 rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-60 flex items-center gap-1">
                            {paying === tax._id
                              ? <><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>{t.processing}</>
                              : t.payNow}
                          </button>
                        : <button onClick={() => downloadReceipt(tax)}
                            className="text-xs text-brand font-medium hover:underline flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                            {t.receipt}
                          </button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
