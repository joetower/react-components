import MainLayout from '../components/layouts/MainLayout';
import Paragraph from '../components/text/TextBlock';
import Heading from '../components/text/Heading';
import ResponsiveImage from '../components/responsive-image/ResponsiveImage';
import Quote from '../components/text/Blockquote';
import Callout from '../components/callout/Callout';

function Home() {
  return (
    <MainLayout baseClass='page home-page'>
      <title>Application example using Vite + React</title>
      <meta name="description" content="A simple Vite + React app with a component library." />
      <meta name="keywords" content="Vite, React, component library, example site" />
      <Heading level='h1' baseClass='intro__heading' content='Hello Vite + React!' />
      <Paragraph baseClass='intro__paragraph' style='emphasized' width='content'>
        <p>This site exists to use a set of <a href="/storybook" title="Storybook Components (opens in new tab/window)" target='_blank'>custom React components &#8599;</a> that I developed and continue to refine & extend.</p>
      </Paragraph>
        <Paragraph baseClass='intro__paragraph' style='default' width='content'>
            <p>This site also showcases my photography work from <a href="https://joetower.com/articles/?category=travel" title="Travel category of articles on my website (opens in new tab/window)" target='_blank'>my travels &#8599;</a>.</p>
        </Paragraph>
      <Quote align="left" baseClass='quote' style='quote' content="Never worry about failure. It's gonna happen. But that's OK: Go ahead, take chances… and you might just find that what feels like failure isn't failure at all, it's what inspires you to dream even bigger." author="Kermit the Frog" theme='tertiary' width='content' />
      <Callout heading='Callout component' alignment='center' animation={true} text="This is a callout component. It is made up of combining three components: the heading, text-block, and button components." theme='secondary' link='#' linkText='Call to Action' linkTitle='Link that goes nowhere, just for demonstration' />
      <ResponsiveImage 
      imageName="2-12-6-32-AM-2023-FUJIFILM-X-T3-DSCF1862"
      alt="Elephants drinking water | Uganda" 
      caption='Elephants drinking water | Uganda'
      credit="Photo by Joe Tower"
      sizes={[200, 400, 600, 800, 1200, 1400, 1600]}/>
    </MainLayout>
  )
}

export default Home;
