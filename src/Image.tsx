/* eslint-disable jsx-a11y/alt-text */
/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { RefObject, useEffect, useMemo, useRef, useState } from 'react'
import Spinner from './Spinner'

type ImgElementProps = React.ImgHTMLAttributes<HTMLImageElement>

interface ImageProps extends ImgElementProps {
  threshold?: number
  loadingIcon?: React.ReactNode
}

/**
 * useShowImage - hook to get ref element intersection over interaction observer
 * @param ref any element
 * @returns showImage state
 */
const useShowImage = (ref: RefObject<HTMLElement>, threshold = 0.6) => {
  const [showImage, setShowImage] = useState(false)
  const intersectionObserver = useMemo(
    () =>
      new IntersectionObserver(
        ([entry]) => setShowImage(entry.isIntersecting),
        { threshold }
      ),
    [threshold]
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
  const [showImage] = useShowImage(ref, props.threshold)
  const [isImgLoading, setIsImgLoading] = useState(true)
  // spinnerWrapper - is used with position absolute to stop flickering when image appears
  const spinnerWrapper = css`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `

  // we show image always after it is loaded, no matter if it disappears from the screen
  return (
    <figure
      ref={ref}
      css={css`
        height: 80vh;
        margin-bottom: 10px;
        background-color: lightgrey;
        position: relative;
      `}
    >
      {(!isImgLoading || showImage) && (
        <img
          {...props}
          onLoad={() => setIsImgLoading(false)}
          css={css`
            width: 100%;
            height: 80vh;
            object-fit: cover;
          `}
        />
      )}
      {isImgLoading && (
        <div css={spinnerWrapper} className='spinner-container'>
          {props.loadingIcon}
          {!props.loadingIcon && <Spinner />}
        </div>
      )}
    </figure>
  )
}
