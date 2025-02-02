"use client";

import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useActions } from "@/lib/hooks";
import { payArtist } from "@/actions/account";
import { useRouter } from "next/navigation";

export default function PaymentPage({ params }: any) {
  const paramData: any = use(params);
  const [amount, setAmount] = useState("");
  const { execute, loading } = useActions();
  const router = useRouter();
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    execute(payArtist, paramData.id as number, parseFloat(amount)).then((res) => {
      if (res?.success) {
        router.replace(`/admin/users/${paramData.id}/transactions`);
        toast.success(`Payment of $${amount} paid successfully!`);
      } else {
        toast.error(res?.message);
      }
    });
    // Here you would typically integrate with a payment gateway
    setAmount("");
  };

  return (
    <div className="">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Make a Payment</CardTitle>
          <CardDescription>Enter the amount you wish to pay</CardDescription>
        </CardHeader>
        <form onSubmit={handlePayment}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input id="amount" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.01" min="0.01" required />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button loading={loading} disabled={loading} type="submit" className="w-full">
              Pay Now
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
