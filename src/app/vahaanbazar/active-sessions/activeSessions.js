"use client"
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import React from 'react'

const ActiveSessions = () => {
  return (
     <div className="viewDetailsSection">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Active Sessions</h2>
            <Button label="Save" className="py-1 px-3 " />
          </div>
     <Divider />
          <div className="h-full">
           
          </div>
        </div>
  )
}

export default ActiveSessions