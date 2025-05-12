import {
  Edit,
  SimpleForm,
  TextInput,
  DateTimeInput,
  NumberInput,
  required,
  number,
  minValue,
  maxValue,
  ImageInput,
  ImageField,
  SelectArrayInput,
  SelectInput,
} from "react-admin";
import { EventTags } from "../types/event";

const tagChoices = Object.entries(EventTags).map(([, value]) => ({
  id: value,
  name: value,
}));

const categoryChoices = [
  { id: "workshop", name: "Workshop" },
  { id: "conference", name: "Conference" },
  { id: "meetup", name: "Meetup" },
  { id: "hackathon", name: "Hackathon" },
  { id: "seminar", name: "Seminar" },
  { id: "other", name: "Other" },
];

export const EventEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" validate={required()} fullWidth />
      <TextInput
        source="description"
        multiline
        rows={4}
        validate={required()}
        fullWidth
      />
      <DateTimeInput source="date" validate={required()} />
      <TextInput source="venue" validate={required()} fullWidth />
      <NumberInput
        source="price"
        validate={[required(), number(), minValue(0), maxValue(1000000)]}
      />
      <SelectInput
        source="category"
        choices={categoryChoices}
        validate={required()}
      />
      <SelectArrayInput
        source="tags"
        choices={tagChoices}
        optionText="name"
        optionValue="id"
      />
      <ImageInput source="images" multiple={true} accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);
