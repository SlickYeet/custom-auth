"use client"

import { useFormState } from "react-dom"

import { signOut } from "./actionts"

const initialState = {
  message: "",
}

export default function SignOutButton() {
  const [, action] = useFormState(signOut, initialState)

  return (
    <form action={action}>
      <button>Sign Out</button>
    </form>
  )
}
