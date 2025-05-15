import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@ridex/ui/components/accordion'
import { Card, CardContent, CardHeader } from '@ridex/ui/components/card'
import { Label } from '@ridex/ui/components/label'
import { RadioGroup, RadioGroupItem } from '@ridex/ui/components/radio-group'
import React, { useEffect, useState } from 'react'
import { PreferenceOption } from '@ridex/common'
import { useGetUserQuery, useUpdateUserPreferenceMutation } from '@/redux/user/userApi'
import { Button } from '@ridex/ui/components/button'

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

const PreferenceCard = () => {
  const { data: user, isLoading, isError } = useGetUserQuery();
  const [updateUserPreference, { data: updateUserPreferenceData }] = useUpdateUserPreferenceMutation();
  const [preferences, setPreferences] = useState<Preference[]>([
    { id: "chattiness", name: "Chattiness", value: null },
    { id: "music", name: "Music", value: null },
    { id: "smoking", name: "Smoking", value: null },
    { id: "pets", name: "Pets", value: null },
  ])
  const [preferenceChanged, setPreferenceChanged] = useState<Boolean>(false)

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

  useEffect(() => {
    if (user) {
      if (
        user.chatPreference !== preferences.find(pref => pref.id === 'chattiness')?.value ||
        user.musicPreference !== preferences.find(pref => pref.id === 'music')?.value ||
        user.smokingPreference !== preferences.find(pref => pref.id === 'smoking')?.value ||
        user.petPreference !== preferences.find(pref => pref.id === 'pets')?.value
      ) {
        setPreferenceChanged(true)
      } else {
        setPreferenceChanged(false)
      }
    }
  }, [preferences])

  const handleValueChange = (id: Preference["id"], value: PreferenceOption) => {
    setPreferences(prev =>
      prev.map(pref => (pref.id === id ? { ...pref, value } : pref))
    )
  }

  const getDisplayText = (id: Preference["id"], value: PreferenceOption | null) => {
    if (!value) return "Not set"
    const option = preferenceOptions[id].find(opt => opt.value === value)
    return option ? `${option.emoji} ${option.label}` : "Not set"
  }

  const handlePreferenceChange = async () => {
    const preferanceData = {
      chatPreference: preferences.find(pref => pref.id === 'chattiness')?.value || undefined,
      musicPreference: preferences.find(pref => pref.id === 'music')?.value || undefined,
      smokingPreference: preferences.find(pref => pref.id === 'smoking')?.value || undefined,
      petPreference: preferences.find(pref => pref.id === 'pets')?.value || undefined,
    }
    try {
      await updateUserPreference(preferanceData).unwrap()
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <Card className='my-4 border-none'>
      <CardHeader className='font-medium flex items-center justify-between text-accent dark:text-primary'>
        Travel Preferences
        <Button
          variant="link"
          disabled={!preferenceChanged}
          onClick={handlePreferenceChange}
          className='text-accent dark:text-primary'
        >
          Save</Button>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-2">
          {preferences.map((preference) => (
            <AccordionItem key={preference.id} value={preference.id} className="">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{preference.name}</span>
                  <span className="text-muted-foreground">
                    {getDisplayText(preference.id, preference.value)}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 pt-1">
                <RadioGroup
                  value={preference.value || ""}
                  onValueChange={(value: PreferenceOption) =>
                    handleValueChange(preference.id, value)
                  }
                  className="space-y-3"
                >
                  {preferenceOptions[preference.id].map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem
                        value={option.value}
                        id={`${preference.id}-${option.value}`}
                        className='bg-white border-accent/30 dark:border-primary border-1'
                      />
                      <Label
                        htmlFor={`${preference.id}-${option.value}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span className="text-lg">{option.emoji}</span>
                        <span>{option.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

export default PreferenceCard