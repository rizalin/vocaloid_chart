import React, { FC } from "react"
import Link from "next/link"

interface HpLinkButtonProps {
  image: string
  label: string
  link: string
}

const HpLinkButton: FC<HpLinkButtonProps> = ({ link, label, image }) => {
  return (
    <Link href={link}>
      <a className="home__links__capsule">
        <img src={image} alt={label} />
        <div className="home__links__capsule__overlay">{label}</div>
      </a>
    </Link>
  )
}

export default HpLinkButton
