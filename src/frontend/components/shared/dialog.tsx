import { useEffect, useRef } from "react";

interface DialogProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const Dialog = ({
  isDialogOpen,
  closeDialog,
  children,
  className,
}: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (isDialogOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isDialogOpen]);

  if (!isDialogOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={closeDialog}
      className={
        "z-400 fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center flex-col justify-center bg-opacity-50 rounded-3xl p-4" +
        " " +
        className
      }
    >
      {children}
    </dialog>
  );
};
