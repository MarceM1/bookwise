"use server";

import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  console.log("dentro de signInWithCredentials");
  const { email, password } = params;
  console.log("params: ", params);

  const ip = (await headers()).get("x-forwareded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

  try {
    console.log("dentro del try de signInWithCredentials");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log("results:", result);
    if (result?.error) {
      return { success: false, error: result.error };
    }
    return { success: true, result };
  } catch (error) {
    console.log(error, "Signin error");
    return { success: false, error: "Signin error" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  console.log("iniciando signUp");

  const { fullName, email, universityId, password, universityCard } = params;
  console.log(`fullName: ${fullName}.
    email: ${email}.
    universityId: ${universityId}.
    universityCard: ${universityCard}.
    password: ${password}.
    `);

  const ip = (await headers()).get("x-forwareded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

  //check if the user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  console.log("existingUser: ", existingUser);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await hash(password, 10);
  console.log("hashedPassword: ", hashedPassword);

  try {
    console.log("dentro de bloque try");
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      password: hashedPassword,
      universityCard,
    });
    console.log("despues de la insercion");
    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    console.log(error, "Signup error");
    return { success: false, error: "Signup error" };
  }
};
