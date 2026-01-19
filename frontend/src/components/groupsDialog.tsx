import { useState } from "react";
import { FiArrowRight, FiCheck, FiCopy, FiPlus, FiX } from "react-icons/fi";
import { Dialog } from "./shared/dialog";
import { ImageUploader } from "./shared/image-uploader";

interface GroupsDialogProps {
  dialogState: boolean;
  onClose: () => void;
  onCreateGroup: (
    name: string,
    category: string
  ) => Promise<{
    group: { id: number };
    inviteLink: string;
  }>;
  viewGroup: (groupId: number) => void;
}

export const GroupsDialog = ({
  dialogState,
  onClose,
  onCreateGroup,
  viewGroup,
}: GroupsDialogProps) => {
  const [groupName, setGroupName] = useState("");
  const [category, setCategory] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [groupId, setGroupId] = useState<number | null>(null);
  const [groupSetUp, setGroupSetUp] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!groupName || !category) {
      alert("Bitte füllen Sie alle Felder aus.");
      return;
    }

    setIsLoading(true);
    try {
      const { group, inviteLink } = await onCreateGroup(groupName, category);
      setGroupId(group.id);
      setInviteLink(inviteLink);
      setGroupSetUp(true);
    } catch (err) {
      alert("Fehler beim Erstellen der Gruppe");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setGroupName("");
    setCategory("");
    setInviteLink("");
    setGroupSetUp(false);
    setCopySuccess(false);
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog
      isDialogOpen={dialogState}
      closeDialog={handleClose}
      className="p-20 bg-widget"
    >
      <ImageUploader />

      {!groupSetUp ? (
        <>
          <input
            type="text"
            placeholder="Group Name"
            className="border border-gray-300 rounded p-2 w-full mt-4 mb-5"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <select
            className="border bg-widget! border-gray-300 rounded p-2 w-full mt-4 mb-5"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="housing">Housing</option>
            <option value="leisure">Leisure</option>
            <option value="other">Other</option>
          </select>

          <button
            onClick={handleCreate}
            className="action-button action-button--success action-button--full mt-4"
            disabled={isLoading}
          >
            <FiPlus aria-hidden="true" size={16} />
            {isLoading ? "Creating..." : "Create Group"}
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <p className="mb-4 text-center">
            Share this link to invite others to the group:
          </p>
          <div className="bg-background p-2 rounded w-full text-center break-all flex items-center justify-center">
            <span className="truncate">{inviteLink}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(inviteLink);
                setCopySuccess(true);
              }}
              className="ml-2 action-button action-button--icon action-button--primary"
              aria-label={copySuccess ? "Invite link copied" : "Copy invite link"}
              title={copySuccess ? "Invite link copied" : "Copy invite link"}
            >
              {copySuccess ? <FiCheck /> : <FiCopy />}
            </button>
          </div>

          <button
            onClick={() => groupId != null && viewGroup(groupId)}
            className="action-button action-button--success action-button--full mt-4"
            disabled={groupId == null}
          >
            <FiArrowRight aria-hidden="true" />
            View Group
          </button>
        </div>
      )}

      <button
        onClick={handleClose}
        className="action-button action-button--danger action-button--full mt-4 text-primary"
      >
        <FiX aria-hidden="true" />
        Close
      </button>
    </Dialog>
  );
};
