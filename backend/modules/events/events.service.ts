import eventsModel from "./events.model";
import { NotFoundError } from "rest-api-errors";
import { UpdateEventDto } from "./events.dto";

export const updateEvent = async (
  id: string,
  updateData: Partial<UpdateEventDto>
) => {
  const event = await eventsModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  return event;
};
