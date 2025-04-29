import MainLayout from '../components/layouts/MainLayout';
import Paragraph from '../components/text/TextBlock';
import Heading from '../components/text/Heading';
import ResponsiveImage from '../components/responsive-image/ResponsiveImage';

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
