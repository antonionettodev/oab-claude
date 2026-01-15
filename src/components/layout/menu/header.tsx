'use client'

import { useState } from 'react'
import { HeaderTopBar } from './top-bar'
import { HeaderNav, type MenuSection } from './nav'
import { MobileBottomNav } from './mobile'

export function Header() {
  const [activeMenu, setActiveMenu] = useState<MenuSection>(null)
  const [hoveredMenu, setHoveredMenu] = useState<MenuSection>(null)

  const currentMenu = hoveredMenu || activeMenu

  const handleMenuClick = (menu: MenuSection) => {
    setActiveMenu(activeMenu === menu ? null : menu)
    setHoveredMenu(null)
  }

  const handleMouseEnter = (menu: MenuSection) => {
    if (!activeMenu) setHoveredMenu(menu)
  }

  const handleMouseLeave = () => {
    setHoveredMenu(null)
  }

  const closeMenus = () => {
    setActiveMenu(null)
    setHoveredMenu(null)
  }

  return (
    <>
      <header className="w-full">
        {/* Desktop Header */}
        <div className="hidden md:block max-w-7xl mx-auto">
          <div className="px-4 py-2">
            <HeaderTopBar />
          </div>

          <div className="px-4 pb-8">
            <HeaderNav
              currentMenu={currentMenu}
              onMenuClick={handleMenuClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onLinkClick={closeMenus}
            />
          </div>
        </div>
      </header>

      <MobileBottomNav />
    </>
  )
}
