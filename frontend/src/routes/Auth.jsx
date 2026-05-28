import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function Auth() {
  let loggeduser = localStorage.getItem("loggeduser")
  return loggeduser ? <Outlet /> : <Navigate to="/signin" />
}
