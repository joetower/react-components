import MainLayout from '../components/layouts/MainLayout';
import Paragraph from '../components/text/TextBlock';
import Heading from '../components/text/Heading';
import ResponsiveImage from '../components/responsive-image/ResponsiveImage';
import Cards from '../components/cards/Cards';
import Quote from '../components/text/Blockquote';

function About() {
  return (
    <MainLayout baseClass='page about-page'>
      <title>About the app</title>
      <meta name="description" content="About the Vite + React app with a component library." />
      <meta name="keywords" content="Vite, React, component library, example site, about" />
      <Heading level='h1' baseClass='intro__heading' content='About the app' />
      <Paragraph baseClass='intro__paragraph' style='emphasized' width='content'>
        <p>This is an example site to explore the awesomeness of <strong>React</strong> and component libraries. 
        This site is a work in progress and will get updated many times per week.</p>
      </Paragraph>

      <Quote align="left" baseClass='quote' style='quote' content="Travel is fatal to prejuidce, bigotry, and narrow-mindedness, and many of our people need it sorely on these accounts. Broad, wholesome, charitable views of men and things cannot be acquired by vegetating in one little corner of the earth all one's lifetime" author="Mark Twain" theme='quaternary' width='content' />
      
      <Cards heading='Some Card Examples' text='This card data is coming from a card-data.json file. I will change this someday to be custom content or pull from an API' gridCount='3' animation={true} width='content'/>
      <ResponsiveImage 
      imageName="6-08-11-29 AM-2023-FUJIFILM-X-T3-DSCF3413" 
      alt="Scenic view Yosemite National Park" 
      caption='Scenic view of Yosemite National Park'
      credit="Photo by Joe Tower"
      sizes={[200, 400, 600, 800, 1200, 1400, 1600]} />
      
    </MainLayout>
  );
}

export default About;
