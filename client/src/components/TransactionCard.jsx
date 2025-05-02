const TransactionCard = ({ tx }) => (
    <div className="flex justify-between items-center text-gray-700">
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${tx.amount > 0 ? "bg-green-500" : "bg-red-500"}`}
        >
          {tx.amount > 0 ? "+" : "-"}
        </div>
        <div>
          <div className="font-semibold">{tx.accountName || "You"}</div>
          <div className="text-sm">{tx.method || tx.bank}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm">{tx.date} – {tx.time}</div>
        <div className={`font-bold ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
          {tx.amount > 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
        </div>
      </div>
    </div>
  );
  
  export default TransactionCard;
  