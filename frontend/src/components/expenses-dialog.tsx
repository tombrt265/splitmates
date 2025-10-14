import { useState } from "react";
import { Dialog } from "./shared/dialog";
import { MultiSelectDropdown } from "./shared/multi-select-dropdown";


interface ExpensesDialogProps {
  dialogState: boolean;
  onClose: () => void;
  updateExpenses: (expense: {}) => void;
  members: { name: string;
  avatarUrl: string;
  userID: string; }[];
}


export const ExpensesDialog = ({
  dialogState,
  onClose,
  updateExpenses,
  members,
}: ExpensesDialogProps) => {
  const [amount, setAmount] = useState<number>();
  const [description, setDescription] = useState("");
  const [selectedPayer, setSelectedPayer] = useState([""]);
  const [currency, setCurrency] = useState("EUR");
  const [category, setCategory] = useState("");

  const handleClose = () => {
    onClose();
  };

  const handleExpensesCreation = async () => {
    if (!amount || !description || !selectedPayer) {
      alert("Bitte füllen Sie alle Felder aus.");
      return;
    }
    const expense = {
      amount_cents: amount * 100,
      description: description,
      paidBy: selectedPayer[0],
      currency: currency,
      category: category,
      payers: selectedPayer,
    };

    const res = await fetch("http://localhost:5000/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    });
    if (!res.ok) throw new Error("Fehler beim Erstellen des Eintrags");
    const data = await res.json();

    updateExpenses(expense);
    onClose();
  };

  return (
    <Dialog isDialogOpen={dialogState} closeDialog={onClose} className="p-20">
      <h3 className="text-2xl mb-4">Create New Entry</h3>
      <div className="flex flex-row gap-4 justify-center">
        <input 
          type="text"
          size={6}
          placeholder="00,00"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="border p-2 mb-4"
        />
        <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="border p-2 mb-4"
        >
        <option value="EUR">€ (EUR)</option>
        <option value="USD">$ (USD)</option>
        <option value="GBP">£ (GBP)</option>
      </select>
      </div>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 mb-4 w-full"
        >
        <option value="" disabled selected>Select Category</option>
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="Accommodation">Accommodation</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Utilities">Utilities</option>
        <option value="Other">Other</option>
        </select>
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <MultiSelectDropdown members={members} />
      <button
        onClick={() => handleExpensesCreation()}
        className="bg-indigo-500 rounded-lg py-1 px-4 mt-4"
      >
        <h6 className="text-white!">Submit</h6>
      </button>
      <button
        onClick={handleClose}
        className="mt-4 bg-red-500 text-white py-1 px-4 rounded"
      >
        <h6>Close</h6>
      </button>
    </Dialog>
  );
};
