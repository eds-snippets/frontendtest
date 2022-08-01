/* eslint-disable jsx-a11y/alt-text */
/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { RefObject, useEffect, useMemo, useRef, useState } from 'react'

type ImgElementProps = React.ImgHTMLAttributes<HTMLImageElement>

interface ImageProps extends ImgElementProps {}

/**
 * useShowImage - hook to get ref element intersection over interaction observer
 * @param ref any element
 * @returns showImage state
 */
const useShowImage = (ref: RefObject<HTMLElement>) => {
  const [showImage, setShowImage] = useState(false)
  const intersectionObserver = useMemo(
    () =>
      new IntersectionObserver(([entry]) => setShowImage(entry.isIntersecting)),
    []
  )

  useEffect(() => {
    if (ref.current) {
      intersectionObserver.observe(ref.current)
      return () => {
        intersectionObserver.disconnect()
      }
    }
  }, [intersectionObserver, ref])

  return [showImage]
}

export default function Image (props: ImageProps): JSX.Element {
  const ref = useRef(null)
  const [showImage] = useShowImage(ref)
  const [isImgLoading, setIsImgLoading] = useState(true)

  // we show image always after it is loaded, no matter if it disappears from the screen
  return (
    <div
      ref={ref}
      css={css`
        height: 80vh;
        margin-bottom: 10px;
        background-color: lightgrey;
      `}
    >
      {(!isImgLoading || showImage) && (
        <img
          {...props}
          onLoad={() => setIsImgLoading(true)}
          css={css`
            width: 100%;
            height: 80vh;
            object-fit: cover;
          `}
        />
      )}
    </div>
  )
}
