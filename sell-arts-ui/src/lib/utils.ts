import { clsx, type ClassValue } from "clsx";
import { Session } from "next-auth";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasRole(session: Session | null, role: string) {
  if (session == null) {
    return false;
  }
  console.log("HERE", session);
  const res = session.user.authorities.filter((v) => {
    return v.authority === role;
  });

  return res.length > 0;
}

export function calculateTotalFileSize(fileList: File[]) {
  let totalSize = 0;

  for (const file of fileList) {
    totalSize += file.size; // File size in bytes
  }

  return totalSize;
}
