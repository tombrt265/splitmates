import { useState, useEffect } from "react";
import { Dialog } from "../shared/dialog";
import { MultiSelectDropdown } from "../shared/multi-select-dropdown";
import { SingleSelectDropdown } from "../shared/single-select-dropdown";
import { useParams } from "react-router-dom";
import { API_BASE } from "../../api";
import { RouletteWheel } from "../roulette-wheel";
import { Check } from "lucide-react";

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
  const [amount, setAmount] = useState<number | undefined>(undefined);
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
  const possibleCurrencies = ["EUR"];
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

  const handleClose = () => {
    setAmount(undefined);
    setDescription("");
    setPayer(null);
    setIndebtedMembers([]);
    setCurrency(null);
    setCategory(null);

    onClose();
  };

  const handleExpensesCreation = async () => {
    if (!amount || !description || !indebtedMembers || !groupId || !payer) {
      alert("Bitte füllen Sie alle Felder aus.");
      return;
    }

    if (indebtedMembers.length === 0) {
      alert("Bitte wählen Sie mindestens einen Teilnehmer aus.");
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
      setIndebtedMembers((prev) =>
        prev.filter((memberId) => memberId !== payer)
      );
    }
  }, [payer]);

  // Filter out the payer from indebted options
  const indebtedOptions = options.filter((member) => member.id !== payer);

  const [dialogOpen, setDialogOpen] = useState(false);
  const allMembersChecked = indebtedMembers.length === indebtedOptions.length;
  const toggleCheckAllMembers = () => {
    if (allMembersChecked) {
      setIndebtedMembers([]);
    } else {
      setIndebtedMembers(indebtedOptions.map((member) => member.id));
    }
  };

  return (
    <Dialog
      isDialogOpen={dialogState}
      closeDialog={onClose}
      className="p-8 w-[36rem] overflow-visible"
    >
      <h3 className="text-2xl font-semibold pb-12 text-center">
        Create New Entry
      </h3>

      <div className="flex flex-row items-baseline gap-4 w-full">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="flex-1 border rounded-lg p-3"
        />
        <SingleSelectDropdown
          options={currencyOptions}
          selectedOption={currencyOptions[0]?.id}
          headline="Currency"
          width="w-32"
          returnSelected={setCurrency}
        />
      </div>

      <SingleSelectDropdown
        options={categoryOptions}
        selectedOption={category}
        headline="Category"
        width="w-full"
        returnSelected={setCategory}
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={50}
        className="border rounded-lg p-3 my-2 w-full text-[1.6rem]"
      />

      <div className="flex flex-row items-baseline gap-4 w-full">
        <SingleSelectDropdown
          options={options}
          selectedOption={payer}
          headline="Payer"
          width="w-full"
          returnSelected={setPayer}
        />
        <button
          className="px-4 py-3 bg-indigo-600 text-white rounded-xl text-lg font-semibold hover:bg-indigo-700 transition"
          type="button"
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          <span>Roulette</span>
        </button>
        <Dialog
          isDialogOpen={dialogOpen}
          closeDialog={() => setDialogOpen(false)}
          className="p-8 w-[36rem] overflow-visible"
        >
          <RouletteWheel
            items={options.map((member) => member.name)}
            onResult={(winner) => {
              const selected = options.find((member) => member.name === winner);
              if (selected) {
                setPayer(selected.id);
                setTimeout(() => {
                  setDialogOpen(false);
                }, 1000);
                console.log("Selected payer:", selected);
              }
            }}
          />
        </Dialog>
      </div>

      <div className="flex flex-row items-baseline gap-4 w-full">
        <div className="flex flex-row my-auto">
          <input
            type="checkbox"
            checked={allMembersChecked}
            onChange={toggleCheckAllMembers}
          />
        </div>
        <MultiSelectDropdown
          options={indebtedOptions}
          selectedOptions={indebtedMembers}
          headline={allMembersChecked ? "All Members checked" : "Participants"}
          returnSelected={setIndebtedMembers}
        />
      </div>

      <div className="flex gap-4 justify-center w-full mt-8">
        <button
          onClick={handleExpensesCreation}
          className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-3 text-[1.6rem] font-semibold transition-colors"
        >
          Submit
        </button>
        <button
          onClick={handleClose}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 text-[1.6rem] font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </Dialog>
  );
};
