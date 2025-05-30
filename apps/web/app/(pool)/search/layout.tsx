import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center min-h-screen px-4 md:p-6">
      {children}
    </div>
  )
}

export default layout