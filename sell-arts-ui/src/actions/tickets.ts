"use server"

import { fetchHelper } from "@/lib/fetchHelper";
import { ApiResponse, TicketType } from "@/lib/type";

export const getTickets = async () => {
    const res = await fetchHelper(process.env.API_URL + `/tickets`, {
        method: "GET",
    });

    const data: ApiResponse<TicketType[]> = await res.json();

    return data;
};

export const createTicket = async (formData: TicketType) => {
    try {
        
        const res = await fetchHelper(process.env.API_URL + `/tickets`, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data: ApiResponse<TicketType[]> = await res.json();
        console.log("API Response:", data);

        return data;
    } catch (error) {
        console.error("Error creating ticket:", error);
        return { success: false, message: "Failed to create ticket" };
    }
};

export const deleteTicket = async (id: string) => {
    const res = await fetchHelper(process.env.API_URL + `/tickets/${id}`, {
      method: "DELETE",
    });
  
    const data: ApiResponse<TicketType[]> = await res.json();
  
    return data;
  };
