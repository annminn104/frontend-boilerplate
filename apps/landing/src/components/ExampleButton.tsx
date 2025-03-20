'use client'

import { usePostHogEvent } from '../hooks/usePostHog'

export function ExampleButton() {
  const { capture } = usePostHogEvent()

  const handleClick = () => {
    capture('button_clicked', {
      button_name: 'example_button',
      page: 'home',
    })
  }

  return <button onClick={handleClick}>Nhấn vào đây</button>
}
