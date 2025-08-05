import { createSlice } from "@reduxjs/toolkit";
import { reportPost } from "./reportSlice";

interface ReportPostState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | null;
}

const initialState: ReportPostState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: null,
  // data: null,
};

const reportPostSlice = createSlice({
  name: "reportPost",
  initialState,
  reducers: {
    resetReportState(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = null;
      // state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(reportPost.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(reportPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        // nếu cần lưu data:
        // state.data = action.payload;
      })
      .addCase(reportPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message || "Có lỗi xảy ra khi báo cáo.";
      });
  },
});

export const { resetReportState } = reportPostSlice.actions;
export default reportPostSlice.reducer;
