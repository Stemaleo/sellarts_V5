import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { ReactNode, use } from "react";
import { getMyArtWorks } from "@/actions/artwork";
import Form from "next/form";
import ArtFilter from "./ArtFilter";

export default async function UserArtworkGallery({ children }: { children: ReactNode }) {
  return <div className="container mx-auto">{children}</div>;
}
