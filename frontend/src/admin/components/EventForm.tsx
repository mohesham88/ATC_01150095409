import {
  SimpleForm,
  TextInput,
  DateTimeInput,
  NumberInput,
  required,
  number,
  minValue,
  maxValue,
  ImageInput,
  SelectArrayInput,
} from "react-admin";
import { EventTags } from "../types/event";

const tagChoices = Object.entries(EventTags).map(([, value]) => ({
  id: value,
  name: value,
}));

export const EventForm = () => (
  <SimpleForm>
    <TextInput source="name" validate={required()} />
    <TextInput source="description" multiline rows={4} validate={required()} />
    <DateTimeInput source="date" validate={required()} />
    <TextInput source="venue" validate={required()} />
    <NumberInput
      source="price"
      validate={[required(), number(), minValue(0), maxValue(1000000)]}
    />
    <ImageInput source="image" multiple={true} />
    <SelectArrayInput
      source="tags"
      choices={tagChoices}
      optionText="name"
      optionValue="id"
    />
  </SimpleForm>
);
