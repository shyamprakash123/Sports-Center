import React, { Suspense } from "react";
const MatchList = React.lazy(() => import("./MatchList"));
import ErrorBoundary from "../components/ErrorBoundary";

const Matches = () => {
  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<div className="suspense-loading">Loading...</div>}>
          <MatchList />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default Matches;
