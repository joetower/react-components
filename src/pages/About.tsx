import MainLayout from '../components/layouts/MainLayout';
import Paragraph from '../components/text/TextBlock';
import Heading from '../components/text/Heading';
import ResponsiveImage from '../components/responsive-image/ResponsiveImage';
import Cards from '../components/cards/Cards';
import Quote from '../components/text/Blockquote';
import TextWithMediaBlock from '../components/text-with-media/TextWithMedia';

function About() {
  return (
    <MainLayout baseClass='page about-page'>
      <p>
      <title>About the app</title>
      <meta name="description" content="About the Vite + React app with a component library." />
      <meta name="keywords" content="Vite, React, component library, example site, about" />
      <Heading level='h1' baseClass='intro__heading' content='About the app' />
      <Paragraph baseClass='intro__paragraph' style='emphasized' width='content'>
        <p>This is an example site to explore the awesomeness of <strong>React</strong> and component libraries. 
        This site is a work in progress and will get updated many times per week.</p>
      </Paragraph>

      <Paragraph baseClass='intro__paragraph' style='default' width='content'>
        <p>Page transitions and the quote component animations are handled by <a href="https://motion.dev" title="Framer Motion website - opens in new window" target='_blank'>Framer Motion</a>. Animation on cards and text with media is handled by CSS animations with useEffect and vanilla JS.</p>
      </Paragraph>

      <TextWithMediaBlock
        imageAlignment='left'
        width='inner'
        theme='tertiary'
        animation={true}
        baseClass='item'
        twmHeading='Text with Media'
        twmContent="This component composes multiple smaller components: text-block, responsive-image, heading, and button, to form a more complex, reusable UI element. It demonstrates how to effectively combine components, with each one's props passed in as name-spaced variables for clarity and organization."
        twmImageName='6-11-11-29 PM-2023-FUJIFILM-X-T3-DSCF4085'
        twmImageAlt='Sequoia National Park, California'
        twmButtonLabel='Check out the code'
        twmButtonLink='https://github.com/joetower/react-components/tree/main/src/components/text-with-media'
        twmButtonTitle='Look at the code for this component'
        twmButtonType='button-link'
      />

      <Quote align="left" baseClass='quote' style='quote' content="Travel is fatal to prejuidce, bigotry, and narrow-mindedness, and many of our people need it sorely on these accounts. Broad, wholesome, charitable views of men and things cannot be acquired by vegetating in one little corner of the earth all one's lifetime." author="Mark Twain" theme='quaternary' width='content' />
      
      <Cards heading='Some Card Examples' text='This card data is coming from a card-data.json file. I will change this someday to be custom content or pull from an API' gridCount='3' animation={true} width='content' showButtons={false}/>
      
      <ResponsiveImage 
      imageName="6-08-11-29 AM-2023-FUJIFILM-X-T3-DSCF3413" 
      alt="Scenic view Yosemite National Park"
      caption='Scenic view of Yosemite National Park'
      credit="Photo by Joe Tower"
      sizes={[200, 400, 600, 800, 1200, 1400, 1600]} />
      </p>
    </MainLayout>
  );
}

export default About;
