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
  useRecordContext,
  useEditContext,
  RecordContext,
} from "react-admin";
import { EventTags } from "../types/event";
import { ImagesearchRoller } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { categoryChoices } from "../types/event";

export const tagChoices = Object.entries(EventTags).map(([, value]) => ({
  id: value,
  name: value,
}));

const ImageFromBase64 = () => {
  const record = useRecordContext();
  console.log(record);
  if (!record || record[0].images || !record[0].images[0].buffer) return null;
  const data = record[0];
  // Assumes the image is JPEG. Change to image/png if needed.
  const imageSrc = `data:image/jpeg;base64,${data.images[0].buffer}`;

  return (
    <img
      src={imageSrc}
      alt="Preview"
      style={{ maxWidth: 200, marginTop: 10 }}
    />
  );
};

export const EventEdit = ({ record }: { record: any }) => {
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    console.log("record change in EventEdit");
    console.log(record);
    setChanged(true);
  }, [changed]);

  return (
    <Edit>
      <SimpleForm key={record?.id}>
        <TextInput source="name" required={true} fullWidth />
        <TextInput
          source="description"
          multiline
          rows={4}
          required={true}
          fullWidth
        />
        <DateTimeInput source="date" required={true} />
        <TextInput source="venue" required={true} fullWidth />
        <NumberInput
          source="price"
          validate={[number(), minValue(0), maxValue(1000000)]}
        />
        <SelectInput
          source="category"
          choices={categoryChoices}
          required={true}
        />
        <SelectArrayInput
          source="tags"
          choices={tagChoices}
          optionText="name"
          optionValue="id"
        />

        {/* <ExistingImagesInput source="images" />

        <ImageInput source="images" multiple>
          <ImageField source="src" title="title" />
        </ImageInput> */}
      </SimpleForm>
    </Edit>
  );
};
