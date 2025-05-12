import {
  Admin,
  Resource,
  DataProvider,
  RaRecord,
  ListGuesser,
} from "react-admin";
import { AuthProvider } from "./components/AuthProvider";
import { Login } from "./pages/Login";
import { useTranslation } from "react-i18next";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import { EventForm } from "./components/EventForm";
import { EventList } from "./components/EventList";
import { EventEdit } from "./components/EventEdit";
import { adminAxiosInstance as axiosInstance } from "../lib/axios";

const dataProvider: DataProvider = {
  getList: async (resource) => {
    try {
      const { data } = await axiosInstance.get(`/${resource}`);
      return {
        data,
        total: data.length,
      };
    } catch (error) {
      console.error(`Error fetching ${resource}:`, error);
      throw error;
    }
  },
  getOne: async (resource, { id }) => {
    try {
      console.log(`Fetching ${resource} with id:`, id);
      const { data } = await axiosInstance.get(`/${resource}?_id=${id}`);
      console.log("Received data:", data);
      data.id = data._id;
      return { data };
    } catch (error) {
      console.error(`Error fetching ${resource}/${id}:`, error);
      throw error;
    }
  },
  getMany: async (resource, { ids }) => {
    try {
      const { data } = await axiosInstance.get(`/${resource}`);
      return { data: data.filter((item: RaRecord) => ids.includes(item.id)) };
    } catch (error) {
      console.error(`Error fetching many ${resource}:`, error);
      throw error;
    }
  },
  getManyReference: async (resource, { target, id }) => {
    try {
      const { data } = await axiosInstance.get(`/${resource}`);
      return {
        data: data.filter((item: RaRecord) => item[target] === id),
        total: data.length,
      };
    } catch (error) {
      console.error(`Error fetching many reference ${resource}:`, error);
      throw error;
    }
  },
  create: async (resource, { data }) => {
    try {
      const { data: result } = await axiosInstance.post(
        `/${resource}/create`,
        data
      );
      return { data: result };
    } catch (error) {
      console.error(`Error creating ${resource}:`, error);
      throw error;
    }
  },
  update: async (resource, { id, data }) => {
    try {
      const { data: result } = await axiosInstance.patch(
        `/${resource}/${id}`,
        data
      );
      result.id = data._id;
      return { data: result };
    } catch (error) {
      console.error(`Error updating ${resource}/${id}:`, error);
      throw error;
    }
  },
  updateMany: async (resource, { ids, data }) => {
    try {
      const results = await Promise.all(
        ids.map((id) => axiosInstance.put(`/${resource}/${id}`, data))
      );
      return { data: results.map(({ data }) => data) };
    } catch (error) {
      console.error(`Error updating many ${resource}:`, error);
      throw error;
    }
  },
  delete: async (resource, { id }) => {
    try {
      const { data } = await axiosInstance.delete(`/${resource}/${id}`);
      return { data };
    } catch (error) {
      console.error(`Error deleting ${resource}/${id}:`, error);
      throw error;
    }
  },
  deleteMany: async (resource, { ids }) => {
    try {
      const results = await Promise.all(
        ids.map((id) => axiosInstance.delete(`/${resource}/${id}`))
      );
      return { data: results.map(({ data }) => data) };
    } catch (error) {
      console.error(`Error deleting many ${resource}:`, error);
      throw error;
    }
  },
};

export const AdminApp = () => {
  const { t } = useTranslation("admin");

  return (
    <Admin
      authProvider={AuthProvider}
      dataProvider={dataProvider}
      loginPage={Login}
      basename="/admin"
    >
      {/* <Resource
        name="dashboard"
        options={{ label: t("dashboard.overview") }}
        icon={DashboardIcon}
        list={ListGuesser}
      /> */}
      <Resource
        name="events"
        options={{ label: t("events.title") }}
        icon={EventIcon}
        list={EventList}
        create={<EventForm />}
        edit={<EventEdit />}
      />
      {/* <Resource
        name="users"
        options={{ label: t("users.title") }}
        icon={PeopleIcon}
        list={ListGuesser}
      /> */}
      <Resource
        name="settings"
        options={{ label: t("settings.title") }}
        icon={SettingsIcon}
        list={ListGuesser}
      />
    </Admin>
  );
};
