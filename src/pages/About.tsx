import MainLayout from '../components/layouts/MainLayout';
import Paragraph from '../components/text/TextBlock';
import Heading from '../components/text/Heading';

function About() {
  return (
    <MainLayout baseClass='page about-page'>
      <Heading level='h1' baseClass='intro__heading' content='About the app' />
      <Paragraph baseClass='intro__paragraph' style='emphasized' width='content'>
        <p>This is an example site to explore the awesomeness of <strong>React</strong> and component libraries. 
        This site is a work in progress and will get updated many times per week.</p>
      </Paragraph>
    </MainLayout>
  );
}

export default About;
