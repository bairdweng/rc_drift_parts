'use client'

/* eslint-disable jsx-a11y/anchor-has-content */
import Link from 'next/link'
import type { LinkProps } from 'next/link'
import { AnchorHTMLAttributes } from 'react'

const CustomLink = ({ href, ...rest }: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  // Track external link clicks with Google Analytics
  const handleExternalLinkClick = (url: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'click', {
        event_category: 'External Link',
        event_label: url,
        transport_type: 'beacon'
      })
    }
  }

  if (isInternalLink) {
    return <Link className="break-words" href={href} {...rest} />
  }

  if (isAnchorLink) {
    return <a className="break-words" href={href} {...rest} />
  }

  return (
    <a 
      className="break-words" 
      target="_blank" 
      rel="noopener noreferrer" 
      href={href}
      onClick={() => handleExternalLinkClick(href as string)}
      {...rest} 
    />
  )
}

export default CustomLink
