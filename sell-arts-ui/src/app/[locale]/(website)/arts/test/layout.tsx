import { ReactNode, Suspense } from "react";

const Laut = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Suspense fallback={<div>Loadin..</div>} children={children}></Suspense>
    </div>
  );
};

export default Laut;
