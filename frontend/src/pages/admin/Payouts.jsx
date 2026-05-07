import React, { useState, useEffect } from 'react';
import api, { handleApiError } from '../../utils/api';
import toast from 'react-hot-toast';

const Payouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/payouts' + (filter ? '?status=' + filter : ''));
      setPayouts(data.data || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPayouts(); }, [filter]);

  const updatePayout = async (id, status, txId) => {
    try {
      await api.put('/admin/payouts/' + id, { status, transaction_id: txId });
      toast.success('Payout updated.');
      fetchPayouts();
    } catch (err) { handleApiError(err); }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Vendor Payouts</h1>
      <div className="flex gap-2">
        {['pending','processing','paid','failed',''].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={"px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors " + (filter === s ? 'bg-boho-terra text-white' : 'border border-gray-200 text-gray-600 hover:border-boho-terra')}>
            {s || 'All'}
          </button>
        ))}
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Vendor','Amount','Payment Info','Status','Requested','Actions'].map(h=><th key={h} className="table-th">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? Array.from({length:5}).map((_,i)=><tr key={i}><td colSpan={6}><div className="h-10 bg-gray-50 animate-pulse m-2 rounded"/></td></tr>) :
            payouts.length === 0 ? <tr><td colSpan={6} className="py-8 text-center text-gray-400">No payouts found</td></tr> :
            payouts.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="table-td"><div><p className="font-medium text-gray-800">{p.shop_name}</p><p className="text-xs text-gray-400">{p.owner_name}</p></div></td>
                <td className="table-td font-semibold text-boho-terra">Rs.{p.amount}</td>
                <td className="table-td text-xs text-gray-500">{p.notes}</td>
                <td className="table-td"><span className={"badge text-xs capitalize " + (p.status === 'paid' ? 'bg-green-100 text-green-700' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600')}>{p.status}</span></td>
                <td className="table-td text-gray-400 text-xs">{new Date(p.requested_at).toLocaleDateString()}</td>
                <td className="table-td">
                  {p.status === 'pending' && (
                    <button onClick={() => { const txId = prompt('Transaction ID (optional):'); updatePayout(p.id, 'paid', txId); }}
                      className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600">Mark Paid</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payouts;
