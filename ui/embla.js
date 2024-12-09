import React, { useEffect, useCallback, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

const CIRCLE_DEGREES = 360
const WHEEL_ITEM_SIZE = 50
const WHEEL_ITEM_COUNT = 12
const WHEEL_ITEMS_IN_VIEW = 4

// Constants for calculating wheel and item positions
export const WHEEL_ITEM_RADIUS = CIRCLE_DEGREES / WHEEL_ITEM_COUNT
export const IN_VIEW_DEGREES = WHEEL_ITEM_RADIUS * WHEEL_ITEMS_IN_VIEW
export const WHEEL_RADIUS = Math.round(
  WHEEL_ITEM_SIZE / 2 / Math.tan(Math.PI / WHEEL_ITEM_COUNT)
)

// Helper function to check if the slide is in view
const isInView = (wheelLocation, slidePosition) =>
  Math.abs(wheelLocation - slidePosition) < IN_VIEW_DEGREES

// Function to set styles for each slide
const setSlideStyles = (emblaApi, index, loop, slideCount, totalRadius) => {
  const slideNode = emblaApi.slideNodes()[index]
  const wheelLocation = emblaApi.scrollProgress() * totalRadius
  const positionDefault = emblaApi.scrollSnapList()[index] * totalRadius
  const positionLoopStart = positionDefault + totalRadius
  const positionLoopEnd = positionDefault - totalRadius

  let inView = false
  let angle = index * -WHEEL_ITEM_RADIUS

  // Check if the slide is in view and update styles accordingly
  if (isInView(wheelLocation, positionDefault)) {
    inView = true
  }

  // Adjust positions for looping effect
  if (loop && isInView(wheelLocation, positionLoopEnd)) {
    inView = true
    angle = -CIRCLE_DEGREES + (slideCount - index) * WHEEL_ITEM_RADIUS
  }

  if (loop && isInView(wheelLocation, positionLoopStart)) {
    inView = true
    angle = -(totalRadius % CIRCLE_DEGREES) - index * WHEEL_ITEM_RADIUS
  }

  // If in view, apply the calculated styles, else reset the styles
  if (inView) {
    slideNode.style.opacity = '1'
    slideNode.style.transform = `translateY(-${
      index * 100
    }%) rotateX(${angle}deg) translateZ(${WHEEL_RADIUS}px)`
  } else {
    slideNode.style.opacity = '0'
    slideNode.style.transform = 'none'
  }
}

// Function to set styles for the container, including the rotation
export const setContainerStyles = (emblaApi, wheelRotation) => {
  emblaApi.containerNode().style.transform = `translateZ(${WHEEL_RADIUS}px) rotateX(${wheelRotation}deg)`
}

export const IosPickerItem = (props) => {

  const { perspective, loop = false, slides = [] } = props // Accept slides as a prop
  const slideCount = slides.length

  // Use Embla carousel hook to initialize the carousel functionality
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    axis: 'y', // Scroll vertically
    dragFree: true, // Allow free dragging
    containScroll: false, // Disable scroll containment
    watchSlides: false // Disable slide watch for performance
  })
  
  // State to track the currently selected slide index
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const rootNodeRef = useRef(null)
  const totalRadius = slideCount * WHEEL_ITEM_RADIUS
  const rotationOffset = loop ? 0 : WHEEL_ITEM_RADIUS

  // Function to deactivate the Embla transform
  const inactivateEmblaTransform = useCallback((emblaApi) => {
    if (!emblaApi) return
    const { translate, slideLooper } = emblaApi.internalEngine()
    translate.clear()
    translate.toggleActive(false)
    slideLooper.loopPoints.forEach(({ translate }) => {
      translate.clear()
      translate.toggleActive(false)
    })
  }, [])

  // Function to rotate the wheel based on scroll progress and update styles
  const rotateWheel = useCallback(
    (emblaApi) => {
      const rotation = slideCount * WHEEL_ITEM_RADIUS - rotationOffset
      const wheelRotation = rotation * emblaApi.scrollProgress()
      setContainerStyles(emblaApi, wheelRotation)
      emblaApi.slideNodes().forEach((_, index) => {
        setSlideStyles(emblaApi, index, loop, slideCount, totalRadius)
      })

      // Update the current slide index based on the scroll progress
      const newIndex = Math.round(emblaApi.scrollProgress() * (slideCount - 1))
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex)
      }
    },
    [slideCount, rotationOffset, totalRadius, currentIndex]
  )

  useEffect(() => {
    if (!emblaApi) return

    // Event listener to handle pointer up (when user stops scrolling)
    emblaApi.on('pointerUp', (emblaApi) => {
      const { scrollTo, target, location } = emblaApi.internalEngine()
      const diffToTarget = target.get() - location.get()
      const factor = Math.abs(diffToTarget) < WHEEL_ITEM_SIZE / 2.5 ? 10 : 0.1
      const distance = diffToTarget * factor
      scrollTo.distance(distance, true) // Scroll smoothly to the target position
    })

    // Update the wheel rotation on scroll
    emblaApi.on('scroll', rotateWheel)

    // Reinitialize the wheel and transform when Embla is reinitialized
    emblaApi.on('reInit', (emblaApi) => {
      inactivateEmblaTransform(emblaApi)
      rotateWheel(emblaApi)
    })

    // Initial setup
    inactivateEmblaTransform(emblaApi)
    rotateWheel(emblaApi)
  }, [emblaApi, inactivateEmblaTransform, rotateWheel])

  return (
    <div className="embla__ios-picker">
        
      {/* Scene wrapper for the carousel */}
      <div className="embla__ios-picker__scene" ref={rootNodeRef}>

        
        <div className={`embla__ios-picker__viewport embla__ios-picker__viewport--perspective-${perspective}`} ref={emblaRef}>
          
          {/* Container for the slides */}
          <div className="embla__ios-picker__container">
            
            {/* Render each slide, apply red text color to the selected one */}
            {slides.map((slide, index) => (
              <div
                className={`embla__ios-picker__slide !text-xl ${index === currentIndex ? 'text-red-800' : ''}`}
                key={index}
                style={{ fontFamily: `var(${slide})` }}
              >
                <div className='h-48'>
                  {props.value}
                </div>
              </div>
            ))}
            
          </div>
        </div>
      </div>
    </div>
  )
}
