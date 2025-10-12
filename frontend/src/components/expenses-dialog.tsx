import { useState } from "react";
import { Dialog } from "./shared/dialog";

interface ExpensesDialogProps {
    dialogState: boolean;
    onClose: () => void;
    updateExpenses: (expense: {}) => void;
    members: { name: string; icon: string }[];
}

export const ExpensesDialog = ({
    dialogState,
    onClose,
    updateExpenses,
    members
}: ExpensesDialogProps) => {

    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState("");
    const [selectedPayer, setSelectedPayer] = useState([""]);
    const [currency, setCurrency] = useState("EUR");
    const [category, setCategory] = useState("");

    const handleClose = () => {
        onClose();
    }

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
            payers: selectedPayer
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
    }

    return (
        <Dialog
            isDialogOpen={dialogState}
            closeDialog={onClose}
            className="p-20"
        >
            <h3 className="text-2xl mb-4">Neuen Eintrag erstellen</h3>
            <input
                type="number"
                placeholder="Betrag"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="border p-2 mb-4 w-full"
            />
            <input
                type="text"
                placeholder="Beschreibung"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 mb-4 w-full"
            />
            {members.map((member) => (
                <li key={member.name} className="list-none mb-2 w-full">
                    <input
                        type="checkbox"
                        id={member.name}
                        value={member.name}
                        checked={selectedPayer.includes(member.name)}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedPayer([...selectedPayer, member.name]);
                            } else {
                                setSelectedPayer(selectedPayer.filter(p => p !== member.name));
                            }
                        }}
                    />
                    <label htmlFor={member.name} className="ml-2">{member.name}</label>
                </li>
            ))}
            <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="border p-2 mb-4 w-full"
            >
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">US-Dollar (USD)</option>
                <option value="GBP">Britisches Pfund (GBP)</option>
            </select>
            <input
                type="text"
                placeholder="Kategorie"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border p-2 mb-4 w-full"
            />
            <button
                onClick={() => handleExpensesCreation()}
                className="bg-indigo-500 rounded-lg p-2 mt-4"
            >
                <h6 className="text-white!">Auftrag absenden</h6>
            </button>
            <button
                onClick={handleClose}
                className="mt-4 bg-red-500 text-white p-1 rounded"
            >
                <h6>Schließen</h6>
            </button>
        </Dialog>
    );
}