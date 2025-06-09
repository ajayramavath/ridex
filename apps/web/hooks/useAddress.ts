import { reverseGeocode } from "@/actions/fetchAddress";
import { PlaceDetails } from "@/actions/getPlaceDetails";
import { setAddress, setLoading } from "@/redux/address/addressSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { useEffect, useState } from "react";

export function useAddress(lat: number, lng: number) {
  const dispatch = useAppDispatch()
  const { data, isLoading } = useAppSelector(state => state.address)
  const address = data[`${lat},${lng}`]

  useEffect(() => {
    if (address) return
    const fetchAddress = async () => {
      dispatch(setLoading(true))
      try {
        const p = await reverseGeocode(lat, lng);
        dispatch(setAddress({ lat: lat, lng: lng, details: p }))
      } catch (e) {
        console.log(e)
      }
      dispatch(setLoading(false))
    }

    fetchAddress()
  }, [lat, lng])

  return { address, isLoading }
}