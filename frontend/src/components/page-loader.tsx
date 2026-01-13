export const PageLoader = ({ page = true }: { page?: boolean }) => {
  const loadingImg = "https://cdn.auth0.com/blog/hello-auth0/loader.svg";

  if (page) {
    return (
      <div className="flex flex-col items-center w-full h-screen">
        <div className="h-20 w-20 m-auto animate-spin-2s">
          <img src={loadingImg} alt="Loading..." />
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-20 w-20 m-auto animate-spin-2s">
        <img src={loadingImg} alt="Loading..." />
      </div>
    );
  }
};
