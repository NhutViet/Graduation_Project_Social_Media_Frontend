import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ItemChatAI, ResHistoryChatAI} from './ChatAITypes';
import {askAI, getHistoryChatAI} from './ChatAISlide';

interface ChatAIState {
  history: ResHistoryChatAI;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | null;
}

const initialState: ChatAIState = {
  history: {
    data: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      limit: 10,
      hasNextPage: false,
      hasPrevPage: false,
    },
  },
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: null,
};

const chatAISlice = createSlice({
  name: 'chatAI',
  initialState,
  reducers: {
    resetChatState: state => {
      state.history = initialState.history;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = null;
    },
  },
  extraReducers: builder => {
    builder
      // Load chat history
      .addCase(getHistoryChatAI.pending, state => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(
        getHistoryChatAI.fulfilled,
        (state, action: PayloadAction<ResHistoryChatAI>) => {
          state.isLoading = false;
          state.isSuccess = true;

          const {currentPage} = action.payload.pagination; // meta.arg.page chính là page bạn dispatch
          const payload = action.payload;

          if (currentPage === 1) {
            state.history.data = payload.data;
          } else {
            state.history.data.push(...payload.data);
          }

          state.history.pagination = payload.pagination;
        },
      )
      .addCase(getHistoryChatAI.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message ??
          action.error.message ??
          'Lấy lịch sử chat thất bại.';
      })
      // Ask AI
      .addCase(askAI.pending, state => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(askAI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Thêm chat mới vào history để hiển thị ngay, tránh gọi lại API history
        const newChat: ItemChatAI = {
          prompt: action.meta.arg.prompt,
          answer: action.payload.answer,
          createdAt: new Date().toISOString(),
        };
        state.history.data.unshift(newChat);
        state.history.pagination.totalCount += 1;
      })
      .addCase(askAI.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload?.message ??
          action.error.message ??
          'Không thể trả lời câu hỏi.';
      });
  },
});

export const {resetChatState} = chatAISlice.actions;
export default chatAISlice.reducer;
