import { useState, useEffect } from "react";
import { Dialog } from "../shared/dialog";
import { MultiSelectDropdown } from "../shared/multi-select-dropdown";
import { SingleSelectDropdown } from "../shared/single-select-dropdown";
import { useParams } from "react-router-dom";
import { API_BASE } from "../../api";
import { RouletteWheel } from "../roulette-wheel";

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
  // Add state for animation
  const [isRouletteMode, setIsRouletteMode] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPayer, setSelectedPayer] = useState<string | null>(null);
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
    if (!amount || !description || !groupId) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!isRouletteMode && !payer) {
      alert("Please select a payer.");
      return;
    }

    if (!isRouletteMode && indebtedMembers.length === 0) {
      alert("Please select at least one participant.");
      return;
    }

    const expense = {
      payerId: payer,
      amount: amount,
      currency: currency || "EUR",
      category: category,
      description: description,
      debtors: indebtedMembers,
      isRouletteExpense: isRouletteMode, // Add this flag
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

  // Add state for final result display
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [finalPayer, setFinalPayer] = useState<string | null>(null);

  const handleRouletteSelection = async () => {
    if (indebtedMembers.length === 0) {
      alert("Please select participants for the roulette");
      return;
    }

    if (!amount || !description || !category) {
      alert("Please fill in all required fields before spinning the roulette");
      return;
    }

    setIsSpinning(true);

    // Animate through members for 3 seconds
    const animationDuration = 3000;
    const intervalTime = 100;
    let elapsed = 0;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * indebtedMembers.length);
      const tempSelected = indebtedMembers[randomIndex];
      setSelectedPayer(tempSelected);

      elapsed += intervalTime;
      if (elapsed >= animationDuration) {
        clearInterval(interval);
        // Final selection
        const finalIndex = Math.floor(Math.random() * indebtedMembers.length);
        const finalSelectedPayer = indebtedMembers[finalIndex];
        setSelectedPayer(finalSelectedPayer);
        setPayer(finalSelectedPayer);
        setFinalPayer(finalSelectedPayer);

        // Show final result
        setIsSpinning(false);
        setShowFinalResult(true);
      }
    }, intervalTime);
  };

  const handleSubmitRouletteExpense = () => {
    if (!payer) {
      alert("Please spin the roulette first!");
      return;
    }
    handleExpensesCreation();
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

      {/* Toggle Roulette Mode Button */}
      {!isRouletteMode ? (
        <button
          className="w-full px-4 py-3 mb-4 bg-indigo-600 text-white rounded-xl text-lg font-semibold hover:bg-indigo-700 transition"
          onClick={() => setIsRouletteMode(true)}
        >
          Switch to Roulette Mode
        </button>
      ) : (
        <button
          className="w-full px-4 py-3 mb-4 bg-red-600 text-white rounded-xl text-lg font-semibold hover:bg-red-700 transition"
          onClick={() => {
            setIsRouletteMode(false);
            setPayer(null);
            setSelectedPayer(null);
            setShowFinalResult(false);
            // Reset all other selections
            setAmount(undefined);
            setDescription("");
            setIndebtedMembers([]);
            setCurrency(null);
            setCategory(null);
          }}
        >
          Exit Roulette Mode
        </button>
      )}

      <div className="flex flex-row items-baseline gap-4 w-full">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="flex-1 border rounded-lg p-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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

      {!isRouletteMode ? (
        // Regular mode UI
        <div className="flex flex-row items-baseline gap-4 w-full">
          <SingleSelectDropdown
            options={options}
            selectedOption={payer}
            headline="Payer"
            width="w-full"
            returnSelected={setPayer}
          />
        </div>
      ) : (
        // Roulette mode UI
        <>
          <MultiSelectDropdown
            options={options}
            selectedOptions={indebtedMembers}
            headline="Select Participants for Roulette"
            returnSelected={setIndebtedMembers}
          />

          {/* Add Spin Roulette button */}
          {indebtedMembers.length > 0 && (
            <button
              onClick={handleRouletteSelection}
              disabled={isSpinning}
              className="w-full mt-4 px-4 py-3 bg-indigo-600 text-white rounded-xl text-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSpinning ? "Spinning..." : "Spin Roulette"}
            </button>
          )}
        </>
      )}

      {!isRouletteMode && (
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
      )}

      {/* Roulette Animation */}
      {isSpinning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <RouletteWheel
            options={indebtedMembers.map((id) => ({
              name: members.find((m) => m.userID === id)?.name || "",
              id: id,
            }))}
            onComplete={(winner) => {
              setSelectedPayer(winner.id);
              setPayer(winner.id);
              setFinalPayer(winner.id);
              setIsSpinning(false);
              setShowFinalResult(true);
            }}
          />
        </div>
      )}

      {/* Final Result Display */}
      {showFinalResult && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Selected payer:{" "}
            <span className="font-semibold">
              {members.find((m) => m.userID === finalPayer)?.name}
            </span>
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center w-full mt-8">
        {isRouletteMode ? (
          <>
            {indebtedMembers.length > 0 && !showFinalResult && (
              <button
                onClick={handleRouletteSelection}
                disabled={isSpinning}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-3 text-[1.6rem] font-semibold transition-colors disabled:opacity-50"
              >
                {isSpinning ? "Spinning..." : "Spin Roulette"}
              </button>
            )}
            {showFinalResult && (
              <button
                onClick={handleSubmitRouletteExpense}
                disabled={!finalPayer || isSpinning}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-3 text-[1.6rem] font-semibold transition-colors disabled:opacity-50"
              >
                Submit
              </button>
            )}
          </>
        ) : (
          <button
            onClick={handleExpensesCreation}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-3 text-[1.6rem] font-semibold transition-colors"
          >
            Submit
          </button>
        )}
        <button
          onClick={handleClose}
          disabled={isSpinning}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 text-[1.6rem] font-semibold transition-colors disabled:opacity-50"
        >
          Close
        </button>
      </div>
    </Dialog>
  );
};
