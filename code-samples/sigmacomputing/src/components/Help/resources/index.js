// @flow
import ConnectToData from '../assets/ConnectToData.svg';
import CreateAWorksheet from '../assets/CreateAWorksheet.svg';
import CreateCharts from '../assets/CreateCharts.svg';
import ExploreData from '../assets/ExploreData.svg';
import Videos from '../assets/Videos.svg';
import Tutorials from '../assets/Tutorials.svg';

export const helpURL = '/help';

export const GettingStartedResources = [
  {
    title: 'What is Sigma?',
    to: 'https://www.youtube.com/watch?v=DKOj7VsONWU',
    image: CreateCharts
  },
  {
    title: 'Getting Started',
    to:
      'https://help.sigmacomputing.com/hc/en-us/sections/115001329327-Getting-Started-with-Sigma',
    image: ConnectToData
  },
  {
    title: 'Create a Worksheet',
    to:
      'https://help.sigmacomputing.com/hc/en-us/sections/115002893327-Creating-your-First-Worksheet',
    image: CreateAWorksheet
  },
  {
    title: 'Explore Data',
    to:
      'https://help.sigmacomputing.com/hc/en-us/sections/115002896088-Working-with-Columns',
    image: ExploreData
  }
];

export const TopResources = [
  {
    to:
      'https://help.sigmacomputing.com/hc/en-us/articles/115001544513-Function-Index',
    title: 'Formula Guide'
  },
  {
    to:
      'https://help.sigmacomputing.com/hc/en-us/articles/115000852293-Composing-New-Worksheets-from-Other-Worksheets',
    title: 'Composing Worksheets'
  },
  {
    to:
      'https://help.sigmacomputing.com/hc/en-us/sections/115002896128-Working-with-Levels-and-Groups',
    title: 'Working with Levels and Groups'
  },
  {
    to:
      'https://help.sigmacomputing.com/hc/en-us/sections/115000249014-Filtering-your-Data',
    title: 'Filtering your Data'
  }
];

export const ClumpedResources = [
  {
    title: 'Tutorials',
    subtitle: 'In-depth articles on everything Sigma',
    to:
      'https://help.sigmacomputing.com/hc/en-us/categories/115000799068-Articles',
    image: Tutorials
  },
  {
    title: 'Videos',
    subtitle: 'Video tutorials to help you get started',
    to: 'https://www.youtube.com/watch?v=DKOj7VsONWU',
    image: Videos
  }
];



// WEBPACK FOOTER //
// ./src/components/Help/resources/index.js