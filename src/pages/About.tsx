import MainLayout from '../components/layouts/MainLayout';
import Paragraph from '../components/text/TextBlock';
import ResponsiveImage from '../components/responsive-image/ResponsiveImage';
import Cards from '../components/cards/Cards';
import Quote from '../components/text/Blockquote';
import TextWithMediaBlock from '../components/text-with-media/TextWithMedia';
import Banner from '../components/banner/Banner';

function About() {
  return (
    <MainLayout baseClass='page about-page'>
      <>
      <title>About the app</title>
      <meta name="description" content="About the Vite + React app with a component library." />
      <meta name="keywords" content="Vite, React, component library, example site, about" />

      <Banner
          heading={'About the app'}
          headingLevel={'h1'}
          text={'This is an animated banner component. Qui incididunt mollit cupidatat occaecat, proident mollit id.'}
          link={'https://github.com/joetower/react-components/tree/main/src/components/banner'}
          linkTitle={'Takes you to github repo for this component'}
          linkText={'Check out the code'}
          animation={true}
          theme={'secondary'}
          buttonSize={'small'}
          imageName={'6-11-11-29-PM-2023-FUJIFILM-X-T3-DSCF4085'}
          imageAlt={'Sequoia National Park, California'}
      />
      <Paragraph baseClass='intro__paragraph' style='emphasized' width='content'>
        <p>
        This is a work in progress and will get updated many times per week until I have full-time employment. After that, updates will be less frequent.
        </p>
      </Paragraph>

      <Paragraph baseClass='intro__paragraph' style='default' width='content'>
        <p>
        Page transitions and the <strong>quote</strong> component animations are handled by <a href="https://motion.dev" title="Framer Motion website - opens in new window" target='_blank'>Framer Motion</a>.</p>
        <p>The animation on <strong>cards</strong> and <strong>text with media</strong> is handled by CSS animations with useEffect and vanilla JS. <strong>text with media</strong> also uses the <code>animation-timeline</code> for parallax movement on thee overlaid shapes.</p>
        
        <p>The banner, above, is using <code>animation-timeline</code> for the parallax image movement on scroll (desktop-only) and CSS animation for the subtle infinite gradient glow.
        </p>
      </Paragraph>

      <TextWithMediaBlock
        imageAlignment='left'
        width='inner'
        theme='tertiary'
        animation={true}
        baseClass='item'
        twmHeading='Text with Media'
        twmContent="This component composes multiple smaller components: text-block, responsive-image, heading, and button, to form a more complex, reusable UI element. It demonstrates how to effectively combine components, with each one's props passed in as name-spaced variables for clarity and organization."
        twmImageName='2-12-6-32-AM-2023-FUJIFILM-X-T3-DSCF1862'
        twmImageAlt='Elephants drinking water and bathing | Uganda'
        twmButtonLabel='Check out the code'
        twmButtonLink='https://github.com/joetower/react-components/tree/main/src/components/text-with-media'
        twmButtonTitle='Look at the code for this component'
        twmButtonType='button-link'
      />
      
      <TextWithMediaBlock
        imageAlignment='right'
        width='inner'
        theme='primary'
        animation={true}
        baseClass='item'
        twmHeading='Text with Media Two: electric boogaloo'
        twmContent="This component composes multiple smaller components: text-block, responsive-image, heading, and button, to form a more complex, reusable UI element. It demonstrates how to effectively combine components, with each one's props passed in as name-spaced variables for clarity and organization."
        twmImageName='6-08-11-29-AM-2023-FUJIFILM-X-T3-DSCF3413'
        twmImageAlt='Yosemite National Park, California'
        twmButtonLabel='Check out the code'
        twmButtonLink='https://github.com/joetower/react-components/tree/main/src/components/text-with-media'
        twmButtonTitle='Look at the code for this component'
        twmButtonType='button-link'
      />

      <Quote align="left" baseClass='quote' style='quote' content="Travel is fatal to prejuidce, bigotry, and narrow-mindedness, and many of our people need it sorely on these accounts." author="Mark Twain" theme='quaternary' width='content' />
      
      <Cards heading='Some Card Examples' text='This card data is coming from a card-data.json file. I will change this someday to be custom content or pull from an API' gridCount='3' animation={true} width='content' showButtons={false}/>
    
        
      <ResponsiveImage 
      imageName="6-08-11-29-AM-2023-FUJIFILM-X-T3-DSCF3413"
      alt="Scenic view Yosemite National Park"
      caption='Scenic view of Yosemite National Park'
      credit="Photo by Joe Tower"
      sizes={[200, 400, 600, 800, 1200, 1400, 1600]} />
      </>
    </MainLayout>
  );
}

export default About;
