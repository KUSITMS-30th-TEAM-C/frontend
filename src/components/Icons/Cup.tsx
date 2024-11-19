import { SVGProps } from 'react'

export default function Cup({ ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="88"
      height="88"
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <rect width="88" height="88" fill="url(#pattern0_771_12919)" />
      <defs>
        <pattern
          id="pattern0_771_12919"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_771_12919"
            transform="translate(-0.138068 -0.0958806) scale(0.00116364)"
          />
        </pattern>
        <image
          id="image0_771_12919"
          width="1000"
          height="1000"
        />
      </defs>
    </svg>
  )
}