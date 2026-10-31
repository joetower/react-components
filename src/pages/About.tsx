import MainLayout from '../components/layouts/MainLayout';
import Paragraph from '../components/text/TextBlock';
import ResponsiveImage from '../components/responsive-image/ResponsiveImage';
import Cards from '../components/cards/Cards';
import Quote from '../components/text/Blockquote';
import TextWithMediaBlock from '../components/text-with-media/TextWithMedia';
import Banner from '../components/banner/Banner';
import Accordion from '../components/accordion/Accordion';
import type { AccordionItem } from '../components/accordion/Accordion';
import Tabs from '../components/tabs/Tabs';

const accordionLearnings: AccordionItem[] = [
  {
    id: 'state-shape',
    title: 'Choosing the shape of the state',
    content: (
      <p>
        Open items are stored as an array of ids, not indexes. Ids stay correct when items are reordered, and a plain array is easy to serialize, log, and pass through props. The "single" mode is enforced when toggling instead of storing a second piece of state.
      </p>
    ),
  },
  {
    id: 'controlled',
    title: 'Controlled and uncontrolled, in one component',
    content: (
      <p>
        Pass <code>defaultOpenIds</code> and the accordion manages itself. Pass <code>openIds</code> with <code>onOpenChange</code> and the parent is in charge. The props are a TypeScript discriminated union, so mixing the two styles is a compile error.
      </p>
    ),
  },
  {
    id: 'accessibility',
    title: 'Accessibility details',
    content: (
      <p>
        Triggers are real buttons inside headings, with <code>aria-expanded</code> and <code>aria-controls</code>. Arrow keys, Home, and End move between triggers. Collapsed panels are <code>inert</code> and hidden, so their contents leave the tab order and the accessibility tree.
      </p>
    ),
  },
  {
    id: 'animation',
    title: 'Animating height without JavaScript',
    content: (
      <p>
        <code>height: auto</code> can't be transitioned, but a grid row can animate from <code>0fr</code> to <code>1fr</code>. The transition is turned off under <code>prefers-reduced-motion</code>.
      </p>
    ),
  },
];

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
          text={"This is an animated banner component and it is using the 'secondary' theme option. The bottom gradient animates in a bottom-to-top pattern, repeatedly getting taller and shorter."}
          link={'https://github.com/joetower/react-components/tree/main/src/components/banner'}
          linkTitle={'Takes you to github repo for this component'}
          linkText={'Check out the code'}
          animation={true}
          theme={'secondary'}
          buttonSize={'small'}
          imageName={'6-11-11-29-PM-2023-FUJIFILM-X-T3-DSCF4085'}
          imageAlt={'Sequoia National Park, California'}
      />
      <Paragraph baseClass='intro__paragraph' style='emphasized' width='components'>
        <p>
        This is a work in progress. I originally started this React application and component library while unemployed in March 2025 and have continued refining it since becoming employed again in June 2025.
        </p>
      </Paragraph>

      <Paragraph baseClass='intro__paragraph' style='default' width='components'>
        <p><strong>Below, I have outlined some details about the site.</strong></p>
      </Paragraph>
      
      <Tabs defaultValue='animation' theme='tertiary' width='components'>
        <Tabs.List aria-label='Details about how the site is built'>
          <Tabs.Tab value='animation'>Animation</Tabs.Tab>
          <Tabs.Tab value='state'>State</Tabs.Tab>
          <Tabs.Tab value='accessibility'>Accessibility</Tabs.Tab>
          <Tabs.Tab value='modularity'>Modularity and personalization</Tabs.Tab>
        </Tabs.List>
      
        <Tabs.Panel value='animation'>
          <ul>
            <li>
              <p>Page transitions and the <strong>quote</strong> component animations are handled by <a href="https://motion.dev" title="Framer Motion website - opens in new window" target='_blank'>Framer Motion</a>.</p>
            </li>
            <li>
              <p>The animation on <strong>cards</strong> and <strong>text with media</strong> is handled by CSS animations with useEffect and vanilla JS. <strong>text with media</strong> also uses the <code>animation-timeline</code> for parallax movement on the overlaid shapes.</p>
            </li>
            <li>
              <p>The banner, above, is using <code>animation-timeline</code> for the parallax image movement on scroll (desktop-only) and CSS animation for the subtle infinite gradient glow.</p>
            </li>
            <li>
              <p><strong>Note:</strong> <code>animation-timeline</code> is available in all browsers except Firefox (<em>as of Oct 2026</em>) so Firefox is sad without the features, but hey, progressive enhancement.</p>
            </li>
          </ul>
        </Tabs.Panel>
      
        <Tabs.Panel value='state'>
          <ul>
            <li>
              <p>The <strong>accordion</strong> and <strong>tabs</strong> components can run on their own state or be controlled by a parent. The shared logic lives in a <code>useControllableState</code> hook.</p>
            </li>
            <li>
              <p>The tabs you're using right now are a compound component: <code>Tabs.List</code>, <code>Tabs.Tab</code>, and <code>Tabs.Panel</code> share the selected tab through React Context.</p>
            </li>
          </ul>
        </Tabs.Panel>
      
        <Tabs.Panel value='accessibility'>
          <ul>
            <li>
              <p>Try the arrow keys, Home, and End on these tabs. Only the selected tab is in the Tab order (a roving tabindex), and each panel is linked to its tab with <code>aria-labelledby</code>.</p>
            </li>
            <li>
              <p>Animations are switched off for people who prefer reduced motion.</p>
            </li>
          </ul>
        </Tabs.Panel>
        
        <Tabs.Panel value='modularity'>
          <ul>
            <li>
              <p>Components are meant to be rearrangeable on a page to effectively tell a story. Their order on the page is not meant to be prescriptive or resemble a "template" to follow.</p>
            </li>
            <li>
              <p>To make components more flexible, several "dials" (options) are presented. For example: <code>width</code>, <code>theme</code>, <code>animation</code>.</p>
            </li>
          </ul>
        </Tabs.Panel>
      </Tabs>

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

      <Quote align="left" baseClass='quote' style='quote' content="Travel is fatal to prejuidce, bigotry, and narrow-mindedness, and many of our people need it sorely on these accounts." author="Mark Twain" theme='quaternary' width='components' />
      
      <Accordion
        groupHeading='Accordion component'
        groupHeadingLevel='h2'
        groupContent={<>This section is the Accordion component, the first one in the library built around React state. The code is in <a href="https://github.com/joetower/react-components/tree/main/src/components/accordion" title="Accordion code on GitHub (opens in new tab/window)" target='_blank'>the repo &#8599;</a>.</>}
        items={accordionLearnings}
        itemHeadingLevel='h3'
        mode='multiple'
        theme='secondary'
        animation={true}
        width='components'
        defaultOpenIds={['state-shape']}
      />
      
      <Cards heading='Some Card Examples' text='This card data is coming from a card-data.json file. I will change this someday to be custom content or pull from an API' animation={true} width='inner' showButtons={false}/>
  

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
