import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@ridex/common'

type UserType = Omit<User, 'password' | 'refresh_token'>

interface UserState {
  currentUser: UserType | null;
}

const initialState: UserState = {
  currentUser: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserType>) => {
      state.currentUser = action.payload
    },
    clearCurrentUser: (state) => {
      state.currentUser = null
    }
  }
})

export default userSlice.reducer;