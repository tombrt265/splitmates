export const PageLoader = () => {
  const loadingImg = "https://cdn.auth0.com/blog/hello-auth0/loader.svg";

  return (
    <div className="h-20 w-20 m-auto animate-spin-2s">
      <img src={loadingImg} alt="Loading..." />
    </div>
  );
};
