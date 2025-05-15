import { autoComplete, Prediction } from '@/actions/autoComplete';
import { PlaceDetails } from '@/actions/getPlaceDetails';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export const fetchSuggestions = createAsyncThunk(
  "autoComplete/fetchSuggestions",
  async ({ type, query, signal }: { type: AutoCompleteType, query: string, signal: AbortSignal }, { rejectWithValue }) => {
    try {
      const res = await autoComplete(query);
      return res as Prediction[];
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        return rejectWithValue(error);
      }
    }
  }
)

type Cache = 'autocompleteCache' | 'placeDetailsCache';

const loadCache = (cache: Cache) => {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const saved = localStorage.getItem(cache);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.warn('Failed to load cache', error);
    return {};
  }
};

const saveCache = (cache: Cache, data: Record<string, any>) => {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    localStorage.setItem(cache, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save cache', error);
  }
};

export type AutoCompleteType = 'searchDeparture' | 'searchDestination' | 'createDeparture' | 'createDestination';

interface AutoCompleteCache {
  [query: string]: Prediction[];
}

interface PlaceDetailsCache {
  [placeId: string]: PlaceDetails;
}

export interface SelectedItem {
  id: string | null;
  description: string | null;
}

export interface AutoCompleteItemState {
  selected: SelectedItem;
  suggestions: Prediction[];
  loading: boolean;
  error: string | null;
}

export type AutoCompleteState = {
  [K in AutoCompleteType]: AutoCompleteItemState;
} & {
  _autocomplete_cache: AutoCompleteCache;
  _place_details_cache: PlaceDetailsCache;
}

const initialItemState: AutoCompleteItemState = {
  selected: { id: null, description: null },
  suggestions: [],
  loading: false,
  error: null,
};

export const initialState: AutoCompleteState = {
  searchDeparture: { ...initialItemState },
  searchDestination: { ...initialItemState },
  createDeparture: { ...initialItemState },
  createDestination: { ...initialItemState },
  _autocomplete_cache: loadCache('autocompleteCache'),
  _place_details_cache: loadCache('placeDetailsCache'),
};

const autoCompleteSlice = createSlice({
  name: "autoComplete",
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<{ type: AutoCompleteType, selected: Prediction }>) => {
      const { type, selected } = action.payload;
      state[type].selected.id = selected.place_id;
      state[type].selected.description = selected.description;
    },
    clearSuggestions: (state, action: PayloadAction<AutoCompleteType>) => {
      state[action.payload].suggestions = [];
    },
    updateAutoCompleteCache: (state, action: PayloadAction<{ query: string; suggestions: Prediction[] }>) => {
      const { query, suggestions } = action.payload;
      state._autocomplete_cache[query] = suggestions;
      saveCache("autocompleteCache", state._autocomplete_cache);
    },
    updatePlaceDetailsCache: (state, action: PayloadAction<{ placeId: string; details: PlaceDetails }>) => {
      const { placeId, details } = action.payload;
      state._place_details_cache[placeId] = details;
      saveCache("placeDetailsCache", state._place_details_cache);
    },
    clearCache: (state) => {
      state._autocomplete_cache = {};
      state._place_details_cache = {};
    },
    setSuggestions: (state, action: PayloadAction<{ type: AutoCompleteType, suggestions: Prediction[] }>) => {
      state[action.payload.type].suggestions = action.payload.suggestions;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSuggestions.pending, (state, action) => {
      const { type, query } = action.meta.arg;
      state[type].loading = true;

      if (state._autocomplete_cache[query]) {
        state[type].suggestions = state._autocomplete_cache[query];
        state[type].loading = false;
      }
    })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        const { type, query } = action.meta.arg;
        if (action.payload) {
          state[type].suggestions = action.payload;
          state._autocomplete_cache[query] = action.payload;
          saveCache("autocompleteCache", state._autocomplete_cache);
        }
        state[type].loading = false;
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        const { type } = action.meta.arg;
        state[type].loading = false;
        if (action.error.message) {
          state[type].error = action.error.message;
        }
      })
  }
})

export const {
  setSelected,
  clearSuggestions,
  updateAutoCompleteCache,
  updatePlaceDetailsCache,
  clearCache,
  setSuggestions
} = autoCompleteSlice.actions;

export default autoCompleteSlice.reducer;