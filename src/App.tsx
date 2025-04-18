import MainLayout from './components/layouts/MainLayout';
import Paragraph from './components/text/TextBlock';
import Heading from './components/text/Heading';
import './App.css';

function App() {
  return (
    <MainLayout baseClass='home-page'>
      <Heading level='h1' baseClass='intro__heading' content='Hello Vite + React!' />
      <Paragraph baseClass='intro__paragraph' style='emphasized' width='content'>
        <p>This is an example site to explore the awesomeness of <strong>React</strong> and component libraries.</p>
      </Paragraph>
      <Paragraph baseClass='paragraph' style='default' width='content' >
        <p>This app applies the components from the <a href="/storybook" title="Storybook Components">Component Library</a></p>
      </Paragraph>
    </MainLayout>
  )
}

export default App
