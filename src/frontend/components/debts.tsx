export const Debts = () => {
  const debts = "300";
  return (
    <>
      <h6>Meine Schulden</h6>
      <h4>{debts} €</h4>
      <button className="bg-red-500 text-white py-1 px-4 rounded">
        Schulden begleichen
      </button>
    </>
  );
};
