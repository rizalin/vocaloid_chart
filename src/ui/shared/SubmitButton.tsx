import React, { FC } from "react"
import { Button, ButtonProps, Spinner } from "@chakra-ui/react"

interface SubmitButtonProps extends ButtonProps {
  isLoading?: boolean
}

const SubmitButton: FC<SubmitButtonProps> = ({ isLoading, children, ...props }) => {
  return (
    <Button {...props} className={`custom_button ${isLoading ? "custom_button--loading" : ""}`}>
      {isLoading ? <Spinner /> : null} <span>{children}</span>
    </Button>
  )
}

export default SubmitButton
