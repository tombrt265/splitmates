import { useState, useEffect } from "react";
import { Dialog } from "../shared/dialog";
import { MultiSelectDropdown } from "../shared/multi-select-dropdown";
import { SingleSelectDropdown } from "../shared/single-select-dropdown";
import { useParams } from "react-router-dom";
import { addExpenseAPI } from "../../api";
import { RouletteWheel } from "../roulette-wheel";
import { FiCheck, FiShuffle, FiX } from "react-icons/fi";

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
      const data = await addExpenseAPI(
        groupId,
        expense.payerId,
        expense.amount,
        expense.currency,
        expense.category,
        expense.description,
        expense.debtors
      );
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
        New Transaction
      </h3>

      <div className="flex flex-row items-baseline gap-4 w-full">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="flex-1 border rounded-lg p-3 text-primary bg-primary"
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
        className="border rounded-lg p-3 my-2 w-full text-base"
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
          className="action-button action-button--primary"
          type="button"
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          <FiShuffle aria-hidden="true" />
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
          className="action-button action-button--success flex-1"
        >
          <FiCheck aria-hidden="true" />
          Submit
        </button>
        <button
          onClick={handleClose}
          className="action-button action-button--danger flex-1"
        >
          <FiX aria-hidden="true" />
          Close
        </button>
      </div>
    </Dialog>
  );
};
