import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  EditButton,
  DeleteButton,
  
} from "react-admin";

export const EventList = () => (
  <List>
    <Datagrid>
      <TextField source="name" />
      <TextField source="description" />
      <DateField source="date" typeof="date" />
      <TextField source="venue" />
      <NumberField source="price" typeof="number" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
