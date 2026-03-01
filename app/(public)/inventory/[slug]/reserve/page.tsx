import { notFound } from "next/navigation";

import z from "zod";

import { prisma } from "@/lib/prisma";

import { Welcome } from "./_components/welcome";
import { PageProps } from "../../_models/interfaces";
import { SelectDate } from "./_components/select-date";
import { SubmitDetails } from "./_components/submit-details";

import { ReservationSteps } from "@/app/(public)/_constants/constants";

const MAP_STEP_TO_COMPONENT = {
  [ReservationSteps.WELCOME]: Welcome,
  [ReservationSteps.SELECT_DATE]: SelectDate,
  [ReservationSteps.SUBMIT_DETAILS]: SubmitDetails,
};

export const MultiStepFormSchema = z.object({
  step: z.nativeEnum(ReservationSteps),
  slug: z.string(),
});

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const slug = params?.slug;
  const step = searchParams?.step;

  const { data, success, error } = MultiStepFormSchema.safeParse({
    slug,
    step: Number(step),
  });

  if (!success) {
    console.log({ error });
    notFound();
  }

  const classified = await prisma.classified.findUnique({
    where: { slug: data.slug },
    include: { make: true },
  });

  if (!classified) notFound();

  const Component = MAP_STEP_TO_COMPONENT[data.step];

  return <Component searchParams={searchParams} params={params} classified={classified} />;
}
