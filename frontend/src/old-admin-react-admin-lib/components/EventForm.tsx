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
  Create,
  SelectInput,
  ImageField,
} from "react-admin";
import { EventTags } from "../../admin/types/event";
import { categoryChoices } from "../../admin/types/event";

const tagChoices = Object.entries(EventTags).map(([, value]) => ({
  id: value,
  name: value,
}));

export const EventForm = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <TextInput
        source="description"
        multiline
        rows={4}
        validate={required()}
      />
      <DateTimeInput source="date" validate={required()} />
      <TextInput source="venue" validate={required()} />
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
      <ImageInput source="images" multiple={true}>
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
);
