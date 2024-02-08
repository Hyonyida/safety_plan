import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridPagination,
  GridToolbarColumnsButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import FileModal from "./fileModal";
import ConfirmDialog from "./confirmModal";
import { DeleteObjectFileApi, useGetFileData } from "../apis/api";
import { Search, SearchIconWrapper, StyledInputBase } from "./search";
import {
  DocxIcon,
  PdfIcon,
  PptIcon,
  TextIcon,
  XlsxIcon,
  ZipIcon,
} from "../icons/icon";

export function FileList() {
  const { data, isLoading, isError, refetch } = useGetFileData(1, 22, 0, 25);
  const [list, setList] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handlePostSuccess = async () => {
    await refetch();
  };

  const handleEditClick = (fileId) => {
    setOpenModal(fileId);
  };

  const handleDeleteClick = () => {
    setOpenConfirm(true);
  };

  const handleDeleteRow = async () => {
    if (list) {
      const ids = list.map((file) => Number(file.id));
      console.log(ids);
      try {
        await DeleteObjectFileApi(ids);
      } catch (error) {
        console.error("Error deleting data:", error);
      }
      setOpenConfirm(false);
    }
  };

  const closeModal = () => {
    setOpenModal(null);
  };

  useEffect(() => {
    if (data) {
      const listData = data.data?.payload.list;
      if (Array.isArray(listData)) {
        setList(listData);
      } else {
        console.error("배열 형식이 아닙니다:", listData);
      }
    }
  }, [data]);

  const filteredList = list
    ? list.filter((file) =>
        file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (isLoading) return <div>Loading</div>;
  if (isError) return <div>Error fetching data</div>;

  let rows = [];
  rows = filteredList.map((file) => ({
    id: file.id,
    fileName: file.fileName,
    contentType: file.contentType,
    modifiedDate: file.modifiedDate,
  }));

  const columns = [
    {
      field: "contentType",
      headerName: "파일 형식",
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "custom-header",
      renderCell: (params) => {
        const contentType = params.value;
        if (contentType.includes("/pdf")) {
          return <PdfIcon />;
        } else if (contentType.includes("/plain")) {
          return <TextIcon />;
        } else if (contentType.includes(".document")) {
          return <DocxIcon />;
        } else if (contentType.includes(".presentation")) {
          return <PptIcon />;
        } else if (contentType.includes(".sheet")) {
          return <XlsxIcon />;
        } else if (contentType.includes("/x-zip-compressed")) {
          return <ZipIcon />;
        } else {
          return null;
        }
      },
    },
    {
      field: "fileName",
      headerName: "파일명",
      flex: 2,
      align: "center",
      headerAlign: "center",
      headerClassName: "custom-header",
    },
    {
      field: "modifiedDate",
      headerName: "최종 수정 날짜",
      flex: 2,
      align: "center",
      headerAlign: "center",
      headerClassName: "custom-header",
      renderCell: (params) => {
        const date = new Date(params.row.modifiedDate);
        const formattedDate = date.toISOString().split("T")[0];
        return formattedDate;
      },
    },
    {
      field: "action",
      headerName: "",
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "custom-header",
      renderCell: (params) => (
        <div>
          <IconButton style={{ backgroundColor: "gray", color: "white" }}>
            <DownloadIcon style={{ fontSize: "small" }} />
          </IconButton>
          <IconButton onClick={() => handleEditClick(params.row.id)}>
            <EditIcon />
          </IconButton>
          {openModal === params.row.id && (
            <FileModal
              open={openModal === params.row.id}
              close={closeModal}
              prevData={params.row}
              onPostSuccess={handlePostSuccess}
            />
          )}
          <IconButton onClick={handleDeleteClick}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        width: "90%",
        height: "70%",
        margin: "auto",
        padding: "50px",
        marginTop: "10px",
      }}
    >
      <Typography variant='h6' align='left' gutterBottom>
        관리자 페이지
      </Typography>

      <Typography variant='h4' align='left' gutterBottom>
        <strong> 안전관리계획서</strong>
      </Typography>
      <div
        style={{
          width: "90%",
          height: "70%",
          margin: "auto",
          background: "white",
          padding: "50px",
          marginTop: "30px",
        }}
      >
        <div
          className='search-container'
          style={{
            marginright: "auto",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder='파일명을 입력하세요'
              inputProps={{ "aria-label": "search" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Search>
          <Button
            variant='contained'
            size='medium'
            style={{ marginLeft: "auto" }}
          >
            일괄 다운로드
          </Button>
          <Button
            variant='contained'
            size='medium'
            style={{ marginLeft: "10px" }}
            onClick={() => setOpenModal(true)}
          >
            안전관리 계획서 추가
          </Button>
          {openModal && (
            <FileModal
              open={true}
              close={closeModal}
              onPostSuccess={handlePostSuccess}
            />
          )}
        </div>
        <div style={{ height: "500px", overflowY: "auto" }}>
          <DataGrid
            style={{ height: "100%" }}
            columns={columns}
            rows={filteredList}
            checkboxSelection
            slots={{
              footer: () => (
                <Stack direction={"row"} padding={1} paddingY={0} gap={2}>
                  <GridToolbarColumnsButton />
                  <GridToolbarExport />
                  <Box flex={"auto"} />
                  <GridPagination />
                </Stack>
              ),
            }}
          />
        </div>
      </div>
      <ConfirmDialog
        title='삭제'
        description='삭제하시겠습니까?'
        buttonText='삭제'
        open={openConfirm}
        closeModal={() => setOpenConfirm(false)}
        action={handleDeleteRow}
        isLoading={false}
      />
    </div>
  );
}