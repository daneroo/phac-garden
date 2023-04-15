import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import Image from "next/image";

const logo = (
  <span style={{ display: 'flex', alignItems: 'center' }}>
    <Image
      style={{ marginRight: '.5rem' }}
      src="/images/garden-logo.svg"
      alt="Garden-Logo"
      width={24}
      height={25}
    />
    <span>PHAC Garden</span>
  </span>
)

const config: DocsThemeConfig = {
  logo,
  project: {
    link: 'https://github.com/daneroo/phac-garden',
  },
  // chat: {
  //   link: 'https://discord.com',
  // },
  // docsRepositoryBase: 'https://github.com/shuding/nextra-docs-template',
  footer: {
    text: 'PHAC Garden Docs',
  },
}

export default config
