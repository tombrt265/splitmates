import { useState, useEffect } from "react";
import { Dialog } from "./shared/dialog";
import { MultiSelectDropdown } from "./shared/multi-select-dropdown";
import { SingleSelectDropdown } from "./shared/single-select-dropdown";
import { useParams } from "react-router-dom";
import { API_BASE } from "../api";

interface ExpensesDialogProps {
  dialogState: boolean;
  onClose: () => void;
  updateExpenses: (expense: {}) => void;
  members: { name: string; avatarUrl: string; userID: string }[];
}

export const ExpensesDialog = ({
  dialogState,
  onClose,
  updateExpenses,
  members,
}: ExpensesDialogProps) => {
  const { groupId } = useParams<{ groupId: string }>();
  const [amount, setAmount] = useState<number>();
  const [description, setDescription] = useState("");
  const [indebtedMembers, setIndebtedMembers] = useState<string[]>([]);
  const [payer, setPayer] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const options = members.map((member) => ({
    id: member.userID,
    name: member.name,
    avatarUrl: member.avatarUrl,
  }));
  const possibleCurrencies = ["EUR", "USD", "GBP"];
  const currencyOptions = possibleCurrencies.map((currency) => ({
    id: currency,
    name: currency,
  }));
  const possibleCategories = [
    "Food",
    "Travel",
    "Accommodation",
    "Entertainment",
    "Utilities",
    "Other",
  ];
  const categoryOptions = possibleCategories.map((category) => ({
    id: category,
    name: category,
  }));

  const handleExpensesCreation = async () => {
    if (!amount || !description || !indebtedMembers || !groupId || !payer) {
      alert("Bitte füllen Sie alle Felder aus.");
      return;
    }
    const expense = {
      payerId: payer,
      amount: amount,
      currency: currency || "EUR",
      category: category,
      description: description,
      debtors: indebtedMembers,
    };

    try {
      const res = await fetch(`${API_BASE}/api/groups/${groupId}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || "Fehler beim Erstellen des Eintrags"
        );
      }
      const data = await res.json();
      updateExpenses(data);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Ein Fehler ist aufgetreten.");
    }
  };

  // Add effect to remove payer from indebted members when selected
  useEffect(() => {
    if (payer) {
      setIndebtedMembers((prev) => prev.filter((memberId) => memberId !== payer));
    }
  }, [payer]);

  // Filter out the payer from indebted options
  const indebtedOptions = options.filter((member) => member.id !== payer);

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
          className="border p-2 my-4"
        />
        <SingleSelectDropdown
          options={currencyOptions}
          headline="Select Currency"
          width="w-24"
          returnSelected={setCurrency}
        />
      </div>
      <SingleSelectDropdown
        options={categoryOptions}
        headline="Select Category"
        width="w-56"
        returnSelected={setCategory}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={20}
        className="border p-2 my-4"
      />
      <MultiSelectDropdown
        options={indebtedOptions}
        headline="Select Indebting Members"
        returnSelected={setIndebtedMembers}
      />
      <SingleSelectDropdown
        options={options}
        headline="Select Payer"
        returnSelected={setPayer}
      />
      <button
        onClick={() => handleExpensesCreation()}
        className="bg-indigo-500 rounded-lg py-1 px-4 mt-4"
      >
        <h6 className="text-white!">Submit</h6>
      </button>
      <button
        onClick={onClose}
        className="mt-4 bg-red-500 text-white py-1 px-4 rounded"
      >
        <h6>Close</h6>
      </button>
    </Dialog>
  );
};
