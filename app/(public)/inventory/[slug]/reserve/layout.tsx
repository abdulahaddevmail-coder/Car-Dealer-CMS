import type { PropsWithChildren } from "react";
import { FormHeader } from "./_components/form-header";

export default function MultiStepFormLayout({ children }: PropsWithChildren) {
  return (
    <main className="max-w-4xl mx-auto p-6 sm:p-8 md:p-10">
      <FormHeader />
      {children}
    </main>
  );
}
