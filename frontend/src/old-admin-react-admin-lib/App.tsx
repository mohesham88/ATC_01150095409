import {
  Admin,
  Resource,
  DataProvider,
  RaRecord,
  ListGuesser,
  useRecordContext,
} from "react-admin";
import { AuthProvider } from "../admin/components/AuthProvider";
import { Login } from "../admin/pages/Login";
import { useTranslation } from "react-i18next";
import EventIcon from "@mui/icons-material/Event";
import SettingsIcon from "@mui/icons-material/Settings";
import { EventForm } from "../old-admin-"react-admin"-lib/EventForm";
import { EventList } from "../old-admin-"react-admin"-lib/EventList";
import { EventEdit } from "../old-admin-"react-admin"-lib/EventEdit";
import { adminAxiosInstance as axiosInstance } from "../lib/axios";
import { use, useEffect } from "react";

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
      const formData = new FormData();

      console.log(data);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("venue", data.venue);
      formData.append("category", data.category);
      formData.append("price", data.price);
      formData.append("date", data.date);
      formData.append("tags", data.tags);

      // Append images
      if (Array.isArray(data.images)) {
        data.images.forEach((file: any) => {
          console.log(file.rawFile);
          <base href="" />;
          formData.append("files", file.rawFile);
          // formData.append("images", file);
        });
      }
      const response = await axiosInstance.post(
        `/${resource}/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = response.data;
      result.id = result._id;
      return { data: result };
    } catch (error) {
      console.error(`Error creating ${resource}:`, error);
      throw error;
    }
  },
  update: async (resource, { id, data }) => {
    try {
      const formData = new FormData();
      const updatedEvenet = data[0];
      console.log(data);
      formData.append("name", updatedEvenet.name);
      formData.append("description", updatedEvenet.description);
      formData.append("venue", updatedEvenet.venue);
      formData.append("category", updatedEvenet.category);
      formData.append("price", updatedEvenet.price);
      formData.append("date", updatedEvenet.date);

      // Handle array fields (tags)
      if (Array.isArray(data.tags)) {
        formData.append("tags", JSON.stringify(data.tags));
      }

      // Append images
      if (Array.isArray(data.images)) {
        data.images.forEach((file: any) => {
          console.log(file);
          formData.append("images", file.rawFile);
        });
      }

      const response = await axiosInstance.patch(
        `/${resource}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data;
      result.id = result._id;
      return { data: result };

      // const { data: result } = await axiosInstance.patch(
      //   `/${resource}/${id}`,
      //   data
      // );
      // result.id = data._id;
      // return { data: result };
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
  const record = useRecordContext();

  useEffect(() => {
    console.log("record change in AdminApp");
    console.log(record);
  }, [record]);
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
        options={{ label: t("events.title") } }
        icon={EventIcon}
        list={EventList}
        create={<EventForm />}
        edit={<EventEdit record={record} />}
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
