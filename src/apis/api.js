import axios from "axios";
import { useQuery } from "react-query";

const getFileData = async (filetype, language, page, pageSize) => {
  try {
    const response = await axios.get(`/ObjectFile`, {
      params: {
        FileType: filetype * 1,
        Language: language * 1,
        Page: page * 1,
        PageSize: pageSize * 1,
      },
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};

export const useGetFileData = (filetype, language, page, pageSize) => {
  return useQuery(["fileData"], () =>
    getFileData(filetype, language, page, pageSize)
  );
};

export const PostObjectFileApi = async (formData) => {
  try {
    const response = await axios.post("/ObjectFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export const PutObjectFileApi = async (formData) => {
  try {
    const response = await axios.put("/ObjectFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};

export const DeleteObjectFileApi = async (submitData) => {
  console.log(submitData);
  try {
    const response = await axios.delete("/ObjectFile", {
      data: submitData,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};
