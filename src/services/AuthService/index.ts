"use server";
import {jwtDecode} from "jwt-decode";
import {cookies} from "next/headers";
import {FieldValues} from "react-hook-form";

export const registerUser = async (userData: FieldValues) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const result = await response.json();
    if (result?.success) {
      (await cookies()).set("accessToken", result?.data?.accessToken);
    }
    return result;
  } catch (error) {
    console.error("Error registering user:", error);
    return {error: "An error occurred while registering the user."};
  }
};

export const logInUser = async (userData: FieldValues) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      },
    );
    const result = await response.json();
    console.log("Login response:", result);
    if (result?.success) {
      (await cookies()).set("accessToken", result?.data?.accessToken);
    }
    return result;
  } catch (error) {
    console.error("Error logging in user:", error);
    return {error: "An error occurred while logging in the user."};
  }
};

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  let decodedToken = null;

  if (accessToken) {
    console.log((decodedToken = await jwtDecode(accessToken)));

    return decodedToken;
  } else {
    return null;
  }
};

// export const getCurrentUser = async () => {
//   const accessToken = (await cookies()).get("accessToken")?.value;
//   if (!accessToken) return null;

//   try {
//     const decoded = jwtDecode<{exp?: number}>(accessToken);
//     if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;
//     console.log("TOKEN PAYLOAD:", decoded);
//     return decoded;
//   } catch {
//     return null;
//   }
// };

export const logOutUser = async () => {
  (await cookies()).delete("accessToken");
};
