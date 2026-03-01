"use server";

import z from "zod";

import { prisma } from "@/lib/prisma";
import { CustomerStatus } from "@/lib/generated/prisma/enums";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@/lib/generated/prisma/internal/prismaNamespace";

type PrevState = {
  success: boolean;
  message: string;
};

const SubscribeSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
});

export const newsletterAction = async (_: PrevState, formData: FormData) => {
  try {
    const { data, success, error } = SubscribeSchema.safeParse({
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
    });

    if (!success) {
      return { success: false, message: error.message };
    }

    const subscriber = await prisma.customer.findFirst({
      where: { email: data.email },
    });

    if (subscriber) {
      return { success: false, message: "You are already subscribed!" };
    }

    await prisma.customer.create({
      data: {
        ...data,
        status: CustomerStatus.SUBSCRIBED,
      },
    });

    return { success: true, message: "Subscribed successfully!" };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { success: false, message: error.message };
    }
    if (error instanceof PrismaClientValidationError) {
      return { success: false, message: error.message };
    }
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Something went wrong!" };
  }
};
