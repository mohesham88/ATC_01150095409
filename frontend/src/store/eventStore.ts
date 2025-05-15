import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { EventTags } from "../admin/types/event";
import axiosInstance, { adminAxiosInstance } from "../lib/axios";

export interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  venue: string;
  price: number;
  category: string;
  tags: EventTags[];
  images: string[];
  capacity: number;
  availableTickets: number;
}

interface EventState {
  events: Event[];
  selectedEvent: Event | null;
  isLoading: boolean;
  error: string | null;
  bookedEvents: string[]; // Array of event IDs that user has booked

  // Actions
  setEvents: (events: Event[]) => void;
  setSelectedEvent: (event: Event | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setBookedEvents: (eventIds: string[]) => void;

  // Async actions
  fetchEvents: () => Promise<void>;
  fetchEventById: (id: string) => Promise<void>;
  createEvent: (event: Omit<Event, "_id">) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  bookEvent: (eventId: string) => Promise<any>;
  fetchUserBookings: () => Promise<void>;
  cancelBooking: (eventId: string) => Promise<void>;
}

export const useEventStore = create<EventState>()(
  devtools(
    (set, get) => ({
      // State
      events: [],
      selectedEvent: null,
      isLoading: false,
      error: null,
      bookedEvents: [],

      // Actions
      setEvents: (events) => set({ events }),
      setSelectedEvent: (event) => set({ selectedEvent: event }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setBookedEvents: (eventIds) => set({ bookedEvents: eventIds }),

      // Async actions
      fetchEvents: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/api/v1/events`,
            {
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch events");
          }

          const data = await response.json();
          set({ events: data, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch events",
            isLoading: false,
          });
        }
      },

      fetchEventById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch(
            `http://localhost:3000/api/v1/events?_id=${id}`
          );
          const data = await response.json();
          set({ selectedEvent: data, isLoading: false });
        } catch (error) {
          set({ error: "Failed to fetch event", isLoading: false });
        }
      },

      createEvent: async (event) => {
        try {
          set({ isLoading: true, error: null });
          const response = await adminAxiosInstance.post(
            "/events/create",
            event
          );
          const newEvent = response.data;
          set((state) => ({
            events: [...state.events, newEvent],
            isLoading: false,
          }));
        } catch (error) {
          set({ error: "Failed to create event", isLoading: false });
        }
      },

      updateEvent: async (id, event) => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch(
            `http://localhost:3000/api/v1/events/${id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(event),
            }
          );
          const updatedEvent = await response.json();
          set((state) => ({
            events: state.events.map((e) => (e._id === id ? updatedEvent : e)),
            selectedEvent:
              state.selectedEvent?._id === id
                ? updatedEvent
                : state.selectedEvent,
            isLoading: false,
          }));
        } catch (error) {
          set({ error: "Failed to update event", isLoading: false });
        }
      },

      deleteEvent: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const response = await adminAxiosInstance.delete(`/events/${id}`);
          if (response.status === 200) {
            set((state) => ({
              events: state.events.filter((e) => e._id !== id),
              selectedEvent:
                state.selectedEvent?._id === id ? null : state.selectedEvent,
              isLoading: false,
            }));
          } else {
            set({ error: "Failed to delete event", isLoading: false });
          }
        } catch (error) {
          set({ error: "Failed to delete event", isLoading: false });
        }
      },

      fetchUserBookings: async () => {
        try {
          const response = await axiosInstance.get(
            `${import.meta.env.VITE_SERVER_URL}/api/v1/bookings/my-bookings`,
            {
              withCredentials: true,
            }
          );

          if (response.status === 200) {
            const bookings = response.data;
            const bookedEventIds = bookings.map(
              (booking: any) => booking.event
            );
            set({ bookedEvents: bookedEventIds });
          }
        } catch (error) {
          console.error("Failed to fetch user bookings:", error);
        }
      },

      bookEvent: async (eventId: string) => {
        try {
          const response = await axiosInstance.post(
            `${import.meta.env.VITE_SERVER_URL}/api/v1/bookings`,
            {
              eventId,
            },
            {
              withCredentials: true,
            }
          );

          if (response.status === 201) {
            set((state) => ({
              bookedEvents: [...state.bookedEvents, eventId],
            }));
            return response.data;
          }
          throw new Error("Failed to book event");
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to book event",
            isLoading: false,
          });
          throw error;
        }
      },

      cancelBooking: async (eventId: string) => {
        try {
          const response = await axiosInstance.delete(
            `${import.meta.env.VITE_SERVER_URL}/api/v1/bookings/${eventId}`,
            {
              withCredentials: true,
            }
          );

          if (response.status === 200) {
            // Remove the event from bookedEvents
            set((state) => ({
              bookedEvents: state.bookedEvents.filter((id) => id !== eventId),
            }));
          } else {
            throw new Error("Failed to cancel booking");
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to cancel booking",
            isLoading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: "event-store",
    }
  )
);
