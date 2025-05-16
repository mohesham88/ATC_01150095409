import eventsModel from "./events.model";
import { NotFoundError } from "rest-api-errors";
import { UpdateEventDto } from "./events.dto";
import { FilterQuery } from "mongoose";

interface GetEventsOptions {
  page?: number;
  perPage?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  filter?: Record<string, any>;
}

export const getAllEvents = async (options: GetEventsOptions = {}) => {
  const {
    page = 1,
    perPage = 10,
    sort = "date",
    order = "ASC",
    filter = {},
  } = options;

  const query = Object.entries(filter).reduce<FilterQuery<any>>(
    (acc, [key, value]) => {
      if (value) {
        if (key === "q") {
          acc.$or = [
            { name: { $regex: value, $options: "i" } },
            { description: { $regex: value, $options: "i" } },
          ];
        } else {
          acc[key] = value;
        }
      }
      return acc;
    },
    {}
  );

  // Calculate skip value for pagination
  const skip = (page - 1) * perPage;

  // Get total count for X-Total-Count header for react-admin
  const total = await eventsModel.countDocuments(query);

  const events = await eventsModel
    .find(query)
    .sort({ [sort]: order === "ASC" ? 1 : -1 })
    .skip(skip)
    .limit(perPage);

  return {
    data: events,
    total,
    page,
    perPage,
  };
};

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

export const deleteEvent = async (id: string) => {
  const event = await eventsModel.findByIdAndDelete(id);

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  return event;
};

export const createEvent = async ({
  name,
  description,
  category,
  date,
  venue,
  price,
  tags,
  images,
}: any) => {
  // images: array of Multer files
  let imageDocs: any[] = [];
  if (images && Array.isArray(images)) {
    imageDocs = images.map((file: any) => ({
      data: file.buffer,
      contentType: file.mimetype,
    }));
  }
  const event = await eventsModel.create({
    name,
    description,
    category,
    date,
    venue,
    price,
    tags,
    image: imageDocs,
  });
  return event;
};
