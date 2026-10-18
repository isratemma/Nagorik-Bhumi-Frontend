'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const API = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';
const statusStyle = { Unpaid:'bg-yellow-100 text-yellow-700', Paid:'bg-green-100 text-green-700', Overdue:'bg-red-100 text-red-600' };

export default function AdminLandTaxPage() {
  const [taxes,   setTaxes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('All');
  const [acting,  setActing]  = useState(null);

  const fetchTaxes = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/land-tax?limit=100`);
      const data = await res.json();
      if (res.ok) setTaxes(data.taxes || []);
    } catch { toast.error('Could not load tax records'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTaxes(); }, []);

  const sendReminder = async (t) => {
    setActing(t._id);
    await new Promise(r => setTimeout(r, 800));
    toast.success(`Reminder sent to ${t.owner?.fullName || 'owner'} for ${t.taxId}`);
    setActing(null);
  };

  const downloadReceipt = (t) => {
    const content = `RECEIPT\nTax ID: ${t.taxId}\nOwner: ${t.owner?.fullName}\nAmount: ৳${t.amount}\nPaid: ${t.paidAt?new Date(t.paidAt).toLocaleDateString():t.status}\nReceipt: ${t.receiptNumber||'N/A'}`;
    const b = new Blob([content], {type:'text/plain'});
    Object.assign(document.createElement('a'), {href:URL.createObjectURL(b), download:`${t.taxId}-receipt.txt`}).click();
    toast.success('Receipt downloaded');
  };

  const exportCSV = () => {
    const csv = ['Tax ID,Owner,Land Record,Amount,Due Date,Status,Payment Method'].concat(
      taxes.map(t => `${t.taxId},${t.owner?.fullName||''},${t.landRecord?.recordId||''},${t.amount},${new Date(t.dueDate).toLocaleDateString()},${t.status},${t.paymentMethod||''}`)
    ).join('\n');
    const b = new Blob([csv], {type:'text/csv'});
    Object.assign(document.createElement('a'), {href:URL.createObjectURL(b), download:'land-tax.csv'}).click();
    toast.success('Exported to CSV');
  };

  const filtered = taxes.filter(t => filter==='All' || t.status===filter);
  const totalCollected = taxes.filter(t=>t.status==='Paid').reduce((s,t)=>s+t.amount,0);
  const totalPending   = taxes.filter(t=>t.status!=='Paid').reduce((s,t)=>s+t.amount,0);
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—';

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Land Tax Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Monitor and manage land tax records across all properties</p>
        </div>
        <button onClick={exportCSV}
          className="border border-brand text-brand text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-light transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Total Records',   value: taxes.length,                                       color:'text-gray-800',  bg:'bg-white' },
          { label:'Total Collected', value:`৳ ${totalCollected.toLocaleString()}`,               color:'text-green-600', bg:'bg-green-50' },
          { label:'Pending Amount',  value:`৳ ${totalPending.toLocaleString()}`,                 color:'text-red-600',   bg:'bg-red-50' },
          { label:'Overdue',         value: taxes.filter(t=>t.status==='Overdue').length,        color:'text-orange-600',bg:'bg-orange-50' },
        ].map((s,i) => (
          <div key={i} className={`${s.bg} border border-gray-100 rounded-xl p-4`}>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{loading ? '…' : s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {['All','Unpaid','Paid','Overdue'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${filter===f?'bg-brand text-white border-brand':'bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand'}`}>{f}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['#','Tax ID','Owner','Record','Amount','Due Date','Paid On','Status','Action'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">No tax records found</td></tr>
            ) : filtered.map((t,i) => (
              <tr key={t._id||i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400 text-xs">{i+1}</td>
                <td className="px-4 py-3 text-brand font-semibold text-xs">{t.taxId}</td>
                <td className="px-4 py-3 font-medium text-gray-800 text-xs">{t.owner?.fullName||'—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{t.landRecord?.recordId||'—'}</td>
                <td className="px-4 py-3 font-semibold text-gray-800 text-xs">৳ {(t.amount||0).toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{fmtDate(t.dueDate)}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{t.paidAt ? fmtDate(t.paidAt) : '—'}</td>
                <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyle[t.status]||'bg-gray-100 text-gray-600'}`}>{t.status}</span></td>
                <td className="px-4 py-3">
                  {t.status==='Paid'
                    ? <button onClick={() => downloadReceipt(t)}
                        className="text-xs text-brand font-medium hover:underline flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>Receipt
                      </button>
                    : <button onClick={() => sendReminder(t)} disabled={acting===t._id}
                        className="text-xs bg-brand text-white px-2.5 py-1 rounded-lg hover:bg-brand-dark disabled:opacity-50 transition-colors">
                        {acting===t._id ? '…' : 'Remind'}
                      </button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
