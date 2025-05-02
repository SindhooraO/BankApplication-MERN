import { useState } from "react";

const DepositModal = ({ onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Direct Pay');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (amount <= 0 || isNaN(amount)) {
      alert("Please enter a valid amount.");
      return;
    }

    if (method === "Credit Card") {
      if (!cardNumber || !cardHolderName || !expiryDate) {
        alert("Please fill in all credit card details.");
        return;
      }
    }

    setIsLoading(true);
    try {
      await onSubmit({
        amount: parseFloat(amount),
        method,
        cardDetails: method === "Credit Card" ? { cardNumber, cardHolderName, expiryDate } : null,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      alert("Deposit failed");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl w-[300px] space-y-4">
        <h2 className="text-2xl font-bold text-red-600 text-center">Deposit</h2>
        <div className="flex gap-4 justify-center">
          <label>
            <input type="radio" name="method" value="Direct Pay" checked={method === "Direct Pay"} onChange={(e) => setMethod(e.target.value)} />
            Direct Pay
          </label>
          <label>
            <input type="radio" name="method" value="Credit Card" checked={method === "Credit Card"} onChange={(e) => setMethod(e.target.value)} />
            Credit Card
          </label>
        </div>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        {/* Credit Card Details Section */}
        {method === "Credit Card" && (
          <>
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Cardholder Name"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Expiry Date (MM/YY)"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </>
        )}

        <div className="flex justify-between">
          <button onClick={onClose} type="button" className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded" disabled={isLoading}>
            {isLoading ? "Processing..." : "Deposit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepositModal;
