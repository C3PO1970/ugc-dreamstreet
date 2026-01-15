/**
 * Platform deep links and utilities
 * We use web URLs since we're not auto-posting via APIs
 */

export type Platform = 'instagram' | 'facebook'

const PLATFORM_URLS: Record<Platform, string> = {
  instagram: 'https://www.instagram.com',
  facebook: 'https://www.facebook.com',
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    } catch {
      return false
    }
  }
}

/**
 * Open platform in new tab
 */
export function openPlatform(platform: Platform): void {
  const url = PLATFORM_URLS[platform]
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * Handle "Post Now" action
 * 1. Copy caption to clipboard
 * 2. Open platform in new tab
 */
export async function handlePostNow(
  platform: Platform,
  caption: string
): Promise<{ copied: boolean }> {
  const copied = await copyToClipboard(caption)
  openPlatform(platform)
  return { copied }
}

/**
 * Get platform display info
 */
export function getPlatformInfo(platform: Platform) {
  const info: Record<Platform, { name: string; icon: string; color: string }> = {
    instagram: {
      name: 'Instagram',
      icon: '📸',
      color: 'from-purple-500 to-pink-500',
    },
    facebook: {
      name: 'Facebook',
      icon: '📘',
      color: 'from-blue-600 to-blue-400',
    },
  }
  return info[platform]
}
