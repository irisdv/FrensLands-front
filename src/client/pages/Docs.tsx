import React from "react";

export default function Docs() {

  return (
    <>

      <div style={{overflowY: "scroll", overflowX: 'hidden', height: '100vh', backgroundColor: "#151d28"}}>
        <div className="bg-home docsPage selectDisable">
          <div className='flex flex-col justify-center'>

            <div className="documentationT my-5 text-center mx-auto pixelated"></div>

            <a href="https://frenslands.notion.site/Documentation-223bb36338434bca9ee442048976d397" target="_blank" className="text-center mx-auto"><div className="notionIcon pixelated"></div></a>

            <div className="whitepaperIcon text-center mx-auto pixelated"></div>

            <a href="https://github.com/FrensLands" target="_blank" className="text-center mx-auto"><div className="gitIcon pixelated"></div></a>

            <div className="aboutUs-line mb-5 text-center mx-auto pixelated"></div>

            <div className="pressKitT mt-3 mb-5 text-center mx-auto pixelated"></div>

            <div className="grid md:grid-cols-3">
             <div className="flex flex-col justify-center text-white pressKitElem md:mb-1 mb-5">
                  <div className="mx-auto text-center flex items-center justify-center h-screen" style={{height: '128px'}}><div className="imgBanners"></div></div>
                  <p className="mx-auto text-center text-fl-grey fontHpxl_JuicyXL md:mb-3 mb-2">BANNERS</p>
                  <a href="https://drive.google.com/file/d/1fl0GTmISq-cfJHpjT4zipHNpFMVAjGqt/view?usp=sharing" target="_blank" className="mx-auto text-center"><p className="fontHPxl-sm">400 x 160</p></a>
                  <a href="https://drive.google.com/file/d/1n3J9XTyCJXKO1dUB6ZQC1qFgpma61eA2/view?usp=sharing" target="_blank" className="mx-auto text-center"><p className="fontHPxl-sm">1220 x 208</p></a>
              </div>

              <div className="flex flex-col justify-center text-white pressKitElem md:mb-1 mb-5">
                  <div className="imgLogo mx-auto text-center"></div>
                  <p className="mx-auto text-center text-fl-grey fontHpxl_JuicyXL md:mb-3 mb-2">Logo</p>
                  <a href="https://drive.google.com/file/d/1Iv6CA4k_FgBcqTZtWNCqf-qv9vEZ2aEe/view?usp=sharing" target="_blank" className="mx-auto text-center"><p className="fontHPxl-sm">Small : 120 x 120</p></a>
                  <a href="https://drive.google.com/file/d/1mUot9wqSYe7KfQmdQDzo0VeA0lm7zH1D/view?usp=sharing" target="_blank" className="mx-auto text-center"><p className="fontHPxl-sm">Large: 400 x 400</p></a>
              </div>

              <div className="flex flex-col text-white pressKitElem md:mb-1 mb-5">
                  <div className="imgMap mx-auto text-center"></div>
                  <p className="mx-auto text-center text-fl-grey fontHpxl_JuicyXL md:mb-3 mb-2">Screenshots</p>
                  <a href="https://frenslands.notion.site/Frens-Lands-0e227f03fa8044638ebcfff414c6be1f" target="_blank" className="mx-auto text-center"><p className="fontHPxl-sm">Gallery</p></a>
                  <p></p>
              </div>
            </div>

          </div>

        </div>

      </div>
      
    </>
  )
}
