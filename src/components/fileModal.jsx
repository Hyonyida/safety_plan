import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Stack,
  Typography,
  Button,
  TextField,
  Chip,
} from "@mui/material";
import { AttachFile } from "@mui/icons-material";
import { useMutation, useQueryClient } from "react-query";
import { PostObjectFileApi, PutObjectFileApi } from "../apis/api";

const FileModal = ({ open, close, prevData, onSuccess }) => {
  const [file, setFile] = useState(null);
  const fileInput = useRef(null);
  const [fileName, setFileName] = useState("");
  const [fileExtend, setFileExtend] = useState("");
  const [fileDate, setFileDate] = useState("");

  const queryClient = useQueryClient();
  const postObjectFile = useMutation(PostObjectFileApi, {
    onSuccess: async () => {
      queryClient.invalidateQueries("ObjectFile");
      const updatedFileList = await queryClient.getQueryData("ObjectFile");
      console.log("Updated file list after upload:", updatedFileList);
      onSuccess();
    },
  });

  const putObjectFile = useMutation(PutObjectFileApi, {
    onSuccess: async () => {
      queryClient.invalidateQueries("ObjectFile");
      const updatedFileList = await queryClient.getQueryData("ObjectFile");
      console.log("Updated file list after update:", updatedFileList);
      onSuccess();
    },
  });

  useEffect(() => {
    if (prevData) {
      setFile(prevData.contentType);
      const filename = prevData.fileName.replace(/\.[^/.]+$/, "");
      setFileName(filename);
      const date = new Date(prevData.modifiedDate);
      setFileDate(date.toISOString().split("T")[0]);
    } else {
      setFile(null);
      setFileName("");
      setFileDate("");
    }
  }, [prevData]);

  const handleCloseModal = () => {
    setFile(null);
    setFileName("");
    close();
  };

  const handleClickUploadButton = () => {
    fileInput.current.click();
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const handleClickSaveButton = async () => {
    if (!file || !fileName) {
      return {
        message: "파일과 파일명은 필수 입력사항입니다.",
        type: "error",
      };
    }
    try {
      const formData = new FormData();
      formData.append("file", file, fileName + "." + fileExtend);

      if (!prevData) {
        formData.append("fileType", 1);
        await postObjectFile.mutateAsync(formData);
      } else {
        formData.append("id", prevData.id);
        await putObjectFile.mutateAsync(formData);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error posting data:", error);
      return { message: "오류가 발생하였습니다.", type: "error" };
    }
  };

  const onUpload = (event) => {
    const uploadFile = event.target.files[0];
    setFile(uploadFile);

    const filename = uploadFile.name.normalize();
    const match = filename.match(/^(.+)\.([^.]+)$/);
    const name = match ? match[1] : "";
    const extend = match ? match[2] : "";

    setFileName(name);
    setFileExtend(extend);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      sx={{ zIndex: 7000 }}
      fullWidth
    >
      <DialogTitle>안전관리계획서</DialogTitle>
      <DialogContent sx={{ gap: 2 }}>
        <Divider />
        <Stack marginTop={2} gap={3}>
          <TextField
            label='파일명'
            size='small'
            value={fileName}
            onChange={handleFileNameChange}
          />
          {prevData ? (
            <TextField
              size='small'
              label='최종 수정 날짜'
              clear='false'
              value={fileDate}
              disabled
            />
          ) : null}

          <Stack direction='row' alignItems='center'>
            <AttachFile fontSize='small' sx={{ marginRight: "4px" }} />
            <Typography sx={{ minWidth: "56px", marginRight: "12px" }}>
              첨부파일
            </Typography>
            <input
              type='file'
              style={{ display: "none" }}
              onChange={onUpload}
              ref={fileInput}
            />
            {file ? (
              <Chip
                label={fileName}
                sx={{
                  border: `1px solid`,
                  color: "darkGreen",
                  fontWeight: 500,
                  bgcolor: "white",
                  "& .MuiChip-deleteIcon": { fill: "green" },
                }}
                onDelete={() => {
                  setFile(null);
                  setFileName("");
                }}
              />
            ) : (
              <Button variant='outlined' onClick={handleClickUploadButton}>
                파일 선택
              </Button>
            )}
          </Stack>
          <Stack direction='row' justifyContent='end' gap={1}>
            <Button variant='outlined' onClick={handleCloseModal}>
              취소
            </Button>
            <Button variant='contained' onClick={handleClickSaveButton}>
              {!prevData ? "저장" : "수정"}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default FileModal;
