# meeting

import { themes } from 'mdx-deck'

export const theme = themes.book

import tony from './static/tony-r.jpg' import ss from './static/ss.png'

Weekly Dev Meeting - 11-16-22

## Weekly Dev Meeting

### 11-16-22

* Google Ads - new campaigns
* Volunteer page follow up
* Wordpress/ other dev tool access
* Tony Robinson / DonorDock?
  * \<Image src={tony} style=\{{ width: '100px', height: '100px' \}} />
* Planning

***

## Planning - Internal Teams

* ### WP Site Maintenance
* ### Shopify
* ### Site Redesign
* ### CCS Tooling

***

### WP Site Maintenance

* Add/ change existing pages using Elementor Pro
* Add new functionality/ styling
  * Shopify integration (?)
  * Redoing the navbar to allow for more
  * Persistent website footer
  * **Additional incremental changes that will make the existing experience better**

***

### Shopify

* Integrate with existing/ new platforms
* Set up POD internally
* Set up theming/ styling for storefront

***

### Site Redesign

* Evaluate best practices for nonprofit web presence
* Analyze existing issues with the site wrt:
  * Accessibility
  * UI/UX
* Evaluate technologies to use
* Be a part of design and build process

***

### CCS Tooling

* Build stuff like the tech behind this presentation! (repo: https://github.com/ChildhoodCancerSociety/notes)
  * Built using [`mdx-deck`](https://github.com/jxnblk/mdx-deck) and [`hygen`](https://www.hygen.io/) templates + some basic CLI tooling
  * \<Image src={ss} style=\{{ width: 200, height: 200 \}} />
  * Stay after for a debrief on this mini-project (and how we'll continue to build it)
* Other potential projects
  * Discord bot
  * Asset pipeline

***

## Epilogue

### Presentation/ Note-taking module

* why?
  * lots of info, easy to forget or misplace small details
  * no easy way to centralize note-taking around organization
    * (that doesnt involve Google Drive)
  * lots of meetings, need to empower PMs and other team members
* powered primarily by `mdx-deck`
  * not a good idea :(
    * DPI scaling issues
    * uses gatsby internally (gross!)
    * would need to rebuild most of the build pipeline or at least change the gatsby parts to figure out relative linking
    * build output is \~400 files and \~8MB (!!!) and takes longer than I'd like (\~3-4 seconds for a single page)
  * evaluating `MDXP` as a replacement
  * any other presentation software (does not have to be mdx/node/web based!) is fine

***

## TODO

* find some replacement for `mdx-deck`
* dev tooling + base presentation/ note compilation (located in `index.js`)
* build tooling
  * does not exist :P
  * run `npx mdx-deck [whatever .mdx file]` and then copy output from repo `public` directory into new
    * none of this currently works anyway
* deployment
  * currently handled via github pages
  * doesnt even work due to aforementioned relative path issues
* documentation
