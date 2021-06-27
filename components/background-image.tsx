import Image from 'next/image'
import { useTheme, Theme } from 'context/theme'
import backgroundLight from '../public/bg-light.jpg'
import backgroundDark from '../public/bg-dark.jpg'

const images: Record<Theme, StaticImageData> = {
  light: backgroundLight,
  dark: backgroundDark,
}

export function BackgroundImage() {
  const { theme } = useTheme()
  console.log(theme)
  return <Image src={images[theme]} alt="" layout="fill" objectFit="cover" />
}
