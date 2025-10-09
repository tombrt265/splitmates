export const OpenClaims = () => {
  const openClaims = "1050";
  return (
    <>
      <h6>Meine offenen Forderungen</h6>
      <h4>{openClaims} €</h4>
      <button className="bg-red-500 text-white py-1 px-4 rounded">
        Forderungen begleichen
      </button>
    </>
  );
};
