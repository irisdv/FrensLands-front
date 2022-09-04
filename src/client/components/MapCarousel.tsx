import React from "react";

const images = ['resources/screens/1.png', 'resources/screens/2.png', 'resources/screens/3.png']

export default function MapCarousel() {

  const [currentImage, setCurrentImage] = React.useState(0);

  const refs : any = images.reduce((acc : any, val, i) => {
    acc[i] = React.createRef();
    return acc;
  }, {});

  const scrollToImage = (i : any) => {
    setCurrentImage(i);
    refs[i].current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  const totalImages = images.length;

  const nextImage = () => {
    if (currentImage >= totalImages - 1) {
      scrollToImage(0);
    } else {
      scrollToImage(currentImage + 1);
    }
  };

  const previousImage = () => {
    if (currentImage === 0) {
      scrollToImage(totalImages - 1);
    } else {
      scrollToImage(currentImage - 1);
    }
  };

  const arrowStyle =
  'absolute text-white text-2xl z-10 bg-black h-10 w-10 rounded-full opacity-75 flex items-center justify-center';

  const sliderControl = (isLeft : any) => (
    <button
      type="button"
      onClick={isLeft ? previousImage : nextImage}
      className={`${arrowStyle} ${isLeft ? 'left-2' : 'right-2'}`}
      style={{ top: '40%' }}
    >
      <span role="img" aria-label={`Arrow ${isLeft ? 'left' : 'right'}`}>
        {isLeft ? '◀' : '▶'}
      </span>
    </button>
  );



  return (
    <>
      <div className="relative bg-fl-black">
        <div className="p-12 flex justify-center w-screen md:w-2/3 items-center mx-auto bg-fl-black">
          <div className="relative w-full">
            <div className="carousel">
              {sliderControl(true)}
              {images.map((img, i) => (
                <div className="w-full flex-shrink-0" key={img} ref={refs[i]}>
                  <img src={img} className="w-full object-contain" />
                </div>
              ))}
              {sliderControl(false)}
            </div>
          </div>
        </div>
      </div>
    </>

  )
}
