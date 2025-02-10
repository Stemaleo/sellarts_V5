"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import { getAllNotificationThunk } from "@/redux/features/notificationFeature";
import moment from "moment";
import { cn } from "@/lib/utils";
import { markAsReadNotifications } from "@/actions/notification";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
}

export default function NotificationButton() {
  const { items: notifications, addingStatus } = useSelector((state: RootState) => state.notification);

  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      dispatch(getAllNotificationThunk("s"));
    }
  }, [status]);

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) {
          markAsReadNotifications().then((res) => {
            if (res.success) {
              dispatch(getAllNotificationThunk("s"));
            }
          });
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.filter((c) => !c.readStatus).length > 0 && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2">
        <div className="max-h-[300px] overflow-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No new notifications</p>
          ) : (
            <ul className="space-y-1">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={cn({
                    "flex flex-col space-y-1 p-4 ": true,
                    "bg-gray-50": !notification.readStatus,
                  })}
                >
                  <h3 className="text-sm font-medium">{notification.message}</h3>
                  <p className="text-sm text-gray-500">{notification.description}</p>
                  <span className="text-xs text-gray-400">{moment(notification.timestamp).fromNow()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
