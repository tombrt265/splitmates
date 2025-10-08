import { FiCopy } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";
import { Dialog } from "../components/shared/dialog";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ImageUploader } from "./image-uploader";

interface GroupsDialogProps {
  dialogState: boolean;
  onClose: () => void;
}

export const GroupsDialog = ({ dialogState, onClose }: GroupsDialogProps) => {
  const link = "https://example.com/splitmates";
  const [groupSetUp, setGroupSetUp] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [category, setCategory] = useState("");
  const userId = useAuth0().user?.sub;

  const handleGroupCreation = async () => {
    if (!groupName || !category) {
      alert("Bitte füllen Sie alle Felder aus.");
      return;
    }
    setGroupSetUp(true);
    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupName, category, userId }),
      });
      if (response.ok) {
        console.log("Group created successfully");
      } else {
        console.error("Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleClose = () => {
    setGroupName("");
    setCategory("");
    setGroupSetUp(false);
    setCopySuccess(false);
    onClose();
  };

  return (
    <Dialog
      isDialogOpen={dialogState}
      closeDialog={handleClose}
      className="p-20"
    >
      <ImageUploader />
      <input
        type="text"
        placeholder="Gruppenname"
        className="border border-gray-300 rounded p-2 w-full mt-4 mb-5"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <select
        className="border border-gray-300 rounded p-2 w-full mt-4 mb-5"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="" disabled selected>
          Kategorie Auswählen
        </option>
        <option value="Essen">Essen</option>
        <option value="Reisen">Reisen</option>
        <option value="Wohnen">Wohnen</option>
        <option value="Freizeit">Freizeit</option>
        <option value="Sonstiges">Sonstiges</option>
      </select>
      {groupSetUp ? (
        <div className="flex flex-col items-center">
          <p className="mb-4 text-center">
            Teile den Link unten, um Mitglieder einzuladen:
          </p>
          <div className="bg-white p-2 rounded w-full text-center break-all">
            {link}
            <button
              onClick={() => {
                navigator.clipboard.writeText(link);
                setCopySuccess(true);
              }}
              className="ml-2"
            >
              {copySuccess ? <FiCheck /> : <FiCopy />}
            </button>
          </div>
          <button
            onClick={() =>
              console.log(
                '"' + groupName + '"' + " einsehen mit Kategorie: " + category
              )
            }
            className="bg-indigo-500 rounded-lg p-2 mt-4"
          >
            <h6 className="text-white!">Gruppe Einsehen</h6>
          </button>
        </div>
      ) : (
        <button
          onClick={() => handleGroupCreation()}
          className="bg-indigo-500 rounded-lg p-2 mt-4"
        >
          <h6 className="text-white!">Fertig</h6>
        </button>
      )}
      <button
        onClick={handleClose}
        className="mt-4 bg-red-500 text-white p-1 rounded"
      >
        <h6>Schließen</h6>
      </button>
    </Dialog>
  );
};
