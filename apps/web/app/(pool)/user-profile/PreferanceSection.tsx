import { useGetUserQuery } from '@/redux/user/userApi'
import { GetUserResponse, PreferenceOption } from '@ridex/common'
import React, { useEffect, useState } from 'react'

interface Preference {
  id: keyof typeof preferenceOptions
  name: string
  value: PreferenceOption | null
}

const preferenceOptions = {
  chattiness: [
    { value: "GOOD", label: "Chatty Cathy", emoji: "😄" },
    { value: "NEUTRAL", label: "Selectively social", emoji: "😐" },
    { value: "AGAINST", label: "Silent traveler", emoji: "🤫" }
  ],
  music: [
    { value: "GOOD", label: "DJ mode", emoji: "🎧" },
    { value: "NEUTRAL", label: "Background vibes", emoji: "🎵" },
    { value: "AGAINST", label: "Quiet cabin", emoji: "🔇" }
  ],
  smoking: [
    { value: "GOOD", label: "Smoke-friendly", emoji: "🚬" },
    { value: "NEUTRAL", label: "No preference", emoji: "🌀" },
    { value: "AGAINST", label: "Fresh air only", emoji: "🌿" }
  ],
  pets: [
    { value: "GOOD", label: "Paw-sitive", emoji: "🐾" },
    { value: "NEUTRAL", label: "Furry-neutral", emoji: "🐶" },
    { value: "AGAINST", label: "Allergies", emoji: "🤧" }
  ]
}



const PreferanceSection = ({ user }: { user: GetUserResponse }) => {

  const [preferences, setPreferences] = useState<Preference[]>([
    { id: "chattiness", name: "Chattiness", value: null },
    { id: "music", name: "Music", value: null },
    { id: "smoking", name: "Smoking", value: null },
    { id: "pets", name: "Pets", value: null },
  ])

  useEffect(() => {
    if (user) {
      setPreferences(prev => (
        prev.map(pref => {
          if (pref.id === 'chattiness') pref.value = user.chatPreference || null;
          if (pref.id === 'music') pref.value = user.musicPreference || null;
          if (pref.id === 'smoking') pref.value = user.smokingPreference || null;
          if (pref.id === 'pets') pref.value = user.petPreference || null;
          return pref;
        })
      )
      )
    }
  }, [user])

  const getDisplayText = (id: Preference["id"], value: PreferenceOption | null) => {
    if (!value) return "Not set"
    const option = preferenceOptions[id].find(opt => opt.value === value)
    return option ? `${option.emoji} ${option.label}` : "Not set"
  }

  return (
    <div className='flex flex-col gap-y-4'>
      <h1 className='text-sm font-bold'>Preferences</h1>
      <div className='flex gap-x-8'>
        <div className='space-y-4 text-muted-foreground'>
          {preferences.map((preference) => {
            return (
              <div className='text-lg font-bold' key={preference.id}>
                {preference.id === 'chattiness' && "Chattiness :"}
                {preference.id === 'music' && "Music :"}
                {preference.id === 'smoking' && "Smoking :"}
                {preference.id === 'pets' && "Pets :"}
              </div>
            )
          })}
        </div>
        <div className='self-stretch text-lg font-bold space-y-4'>
          {preferences.map((preference => {
            return (
              <div key={preference.name}>
                {getDisplayText(preference.id, preference.value)}
              </div>
            )
          }))}
        </div>
      </div>
    </div>
  )
}

export default PreferanceSection