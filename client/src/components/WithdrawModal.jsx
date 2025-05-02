import { useState } from "react";

const WithdrawModal = ({ onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bank, setBank] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ amount: parseFloat(amount), accountNumber, accountName, bank });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl w-[300px] space-y-4">
        <h2 className="text-2xl font-bold text-red-600 text-center">Withdraw</h2>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Account Name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Bank"
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <div className="flex justify-between">
          <button onClick={onClose} type="button" className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Withdraw</button>
        </div>
      </form>
    </div>
  );
};

export default WithdrawModal;
