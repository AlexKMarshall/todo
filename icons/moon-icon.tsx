type Props = React.ComponentPropsWithoutRef<'svg'>

export function MoonIcon(props: Props = {}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 26 26"
      width="26"
      height="26"
      {...props}
    >
      <defs />
      <path
        fill="#FFF"
        fillRule="evenodd"
        d="m13.42126,0.9607c0.78183,0 1.54725,0.06903 2.29047,0.20149c-4.61376,0.91696 -8.08181,4.86371 -8.08181,9.5931c0,5.40941 4.53751,9.79459 10.13484,9.79459c2.89181,0 5.50177,-1.17069 7.34824,-3.04845c-1.82717,4.51484 -6.37337,7.71254 -11.69174,7.71254c-6.9303,0 -12.5479,-5.429 -12.5479,-12.12664s5.6176,-12.12664 12.5479,-12.12664z"
      />
    </svg>
  )
}
