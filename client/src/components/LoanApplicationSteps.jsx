// components/LoanApplicationSteps.jsx
import React from "react";

const LoanApplicationSteps = ({ onBack }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-red-600 mb-4">Loan Application Steps</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-800">
        <li>Fill out your personal and financial information.</li>
        <li>Upload required identity and income documents.</li>
        <li>Review the terms and conditions.</li>
        <li>Submit your loan application for approval.</li>
        <li>Wait for confirmation from our loan officer.</li>
      </ol>
      <button
        className="mt-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full"
        onClick={onBack}
      >
        Back to Recommendation
      </button>
    </div>
  );
};

export default LoanApplicationSteps;
