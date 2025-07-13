import * as React from "react"

interface NoWrapProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
}

const NoWrap: React.FC<NoWrapProps> = ({ children, className, ...props }) => {
  return (
    <span className={`whitespace-nowrap ${className}`} {...props}>
      {children}
    </span>
  )
}

export default NoWrap

