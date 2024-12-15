import React, { useEffect, useCallback, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

// Constants for carousel configuration

// CIRCLE_DEGREES determines the total degrees for the wheel effect
const CIRCLE_DEGREES = 180; 

// WHEEL_ITEM_SIZE defines the size of each individual slide item
const WHEEL_ITEM_SIZE = 100; 

// WHEEL_ITEM_COUNT represents the total number of items (e.g., fonts) in the carousel
const WHEEL_ITEM_COUNT = 16; 

// WHEEL_ITEMS_IN_VIEW defines the number of items visible at once in the carousel
const WHEEL_ITEMS_IN_VIEW = 6; 

// Constants for calculating wheel and item positions based on the above settings
export const WHEEL_ITEM_RADIUS = CIRCLE_DEGREES / WHEEL_ITEM_COUNT;
export const IN_VIEW_DEGREES = WHEEL_ITEM_RADIUS * WHEEL_ITEMS_IN_VIEW;
export const WHEEL_RADIUS = Math.round(
    WHEEL_ITEM_SIZE / 2 / Math.tan(Math.PI / WHEEL_ITEM_COUNT)
);

// Helper function to determine if a slide is in view based on its position
const isInView = (wheelLocation, slidePosition) =>
    Math.abs(wheelLocation - slidePosition) < IN_VIEW_DEGREES;

// Function to apply styles to individual slides based on their position in the wheel
const setSlideStyles = (emblaApi, index, loop, slideCount, totalRadius) => {

    const slideNode = emblaApi.slideNodes()[index];
    const wheelLocation = emblaApi.scrollProgress() * totalRadius;
    const positionDefault = emblaApi.scrollSnapList()[index] * totalRadius;
    const positionLoopStart = positionDefault + totalRadius;
    const positionLoopEnd = positionDefault - totalRadius;

    let inView = false;
    let angle = index * -WHEEL_ITEM_RADIUS;

    // Check if the slide is in view and update styles accordingly
    if (isInView(wheelLocation, positionDefault)) {

        inView = true;
    }

    // Adjust positions for looping effect
    if (loop && isInView(wheelLocation, positionLoopEnd)) {

        inView = true;
        angle = -CIRCLE_DEGREES + (slideCount - index) * WHEEL_ITEM_RADIUS;

    }

    if (loop && isInView(wheelLocation, positionLoopStart)) {

        inView = true;
        angle = -(totalRadius % CIRCLE_DEGREES) - index * WHEEL_ITEM_RADIUS;
    }

    // If the slide is in view, apply the calculated styles; otherwise, reset styles
    if (inView) {

        slideNode.style.opacity = '1';
        slideNode.style.transform = `translateY(-${index * 100}%) rotateX(${angle}deg) translateZ(${WHEEL_RADIUS}px)`;
    } else {

        slideNode.style.opacity = '0';
        slideNode.style.transform = 'none';
    }
};

// Function to apply styles to the container based on the wheel's rotation
export const setContainerStyles = (emblaApi, wheelRotation) => {

    emblaApi.containerNode().style.transform = `translateZ(${WHEEL_RADIUS}px) rotateX(${wheelRotation}deg)`;
};

// Main component for the iOS picker wheel
export const IosPickerItem = (props) => {

    const { perspective, loop = false, slides = [] } = props; // Accept slides as a prop
    const slideCount = slides.length;

    // Initialize Embla carousel hook with custom configuration
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop,
        axis: 'y', // Scroll vertically
        dragFree: false, // Disable free dragging
        containScroll: false, // Disable scroll containment
        startIndex: 5,
        skipSnaps: true,
        align: "center",
        watchSlides: false // Disable slide watch for performance
    });
  
    // State to track the currently selected slide index
    const [currentIndex, setCurrentIndex] = useState(0);

    const rootNodeRef = useRef(null);
    const totalRadius = slideCount * WHEEL_ITEM_RADIUS;
    const rotationOffset = loop ? 0 : WHEEL_ITEM_RADIUS;

    // Function to deactivate Embla's transform and reset positions
    const inactivateEmblaTransform = useCallback((emblaApi) => {
        
        if (!emblaApi) return;
        
        const { translate, slideLooper } = emblaApi.internalEngine();
        
        translate.clear();
        translate.toggleActive(false);

        slideLooper.loopPoints.forEach(({ translate }) => {
            translate.clear();
            translate.toggleActive(false);
        });

    }, []);

    // Function to rotate the wheel based on scroll progress and update styles
    const rotateWheel = useCallback(

    (emblaApi) => {

        const rotation = slideCount * WHEEL_ITEM_RADIUS - rotationOffset;
        const wheelRotation = rotation * emblaApi.scrollProgress();
        setContainerStyles(emblaApi, wheelRotation);
        
        emblaApi.slideNodes().forEach((_, index) => {
            setSlideStyles(emblaApi, index, loop, slideCount, totalRadius);
        });

        // Update the current slide index based on the scroll progress
        const newIndex = Math.round(emblaApi.scrollProgress() * (slideCount - 1));
        
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }

    }, [slideCount, rotationOffset, totalRadius, currentIndex]);

    // Effect hook to handle Embla API events and initialize transformations
    useEffect(() => {

        if (!emblaApi) return;

        // Event listener for when the user stops scrolling (pointer up)
        emblaApi.on('pointerUp', (emblaApi) => {

            const { scrollTo, target, location } = emblaApi.internalEngine();
            const diffToTarget = target.get() - location.get();
            const factor = Math.abs(diffToTarget) < WHEEL_ITEM_SIZE / 2.5 ? 10 : 0.1;
            const distance = diffToTarget * factor;
            
            // Smooth scroll to target position
            scrollTo.distance(distance, true); 

            // Set the selected font for download
            props.setFont(slides[emblaApi.selectedScrollSnap()]);
        });

        // Event listener to update wheel rotation on scroll
        emblaApi.on('scroll', rotateWheel);

        // Reinitialize the wheel and apply the rotation after reinitialization
        emblaApi.on('reInit', (emblaApi) => {

            inactivateEmblaTransform(emblaApi);
            rotateWheel(emblaApi);
        });

        // Initial setup
        inactivateEmblaTransform(emblaApi);
        rotateWheel(emblaApi);

    }, [emblaApi, inactivateEmblaTransform, rotateWheel]);

  // Render the iOS picker component
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
                className={`embla__ios-picker__slide !text-xl ${index === currentIndex ? 'text-[#dfdfed]' : ''}`}
                key={index}
                style={{ fontFamily: `var(${slide.value})` }}
              >
                {index === currentIndex ? (

                  <input
                    value={props.value}
                    className="border-none bg-transparent text-center w-full text-xl focus:outline-none"
                    onInput={(e) => { props.setValue(e.target.value); }} 
                  />

                ) : (

                  // Just display the text when not selected
                  props.value
                )}
              </div>

            ))}
          </div>
          
        </div>

      </div>
    </div>
  );
};

// Wrapper component for the iOS picker
export const FontPicker = ({ fonts, setValue, setFont, value }) => (
  
  <div className="embla w-full h-full flex items-center justify-center">
      <IosPickerItem
          setValue={setValue}
          setFont={setFont}
          value={value}
          slideCount={fonts.length}
          perspective="left"
          loop={false}
          slides={fonts}
      />
  </div>
);
