import { configure } from '@kadira/storybook';

function loadStories() {
  // require('../tests/stories/button');
  // require('../tests/stories/sq-input-slider');
  // require('../tests/stories/sshKeyCard');
  // require('../tests/stories/button');
  // require('../tests/stories/sq-input-slider');
  require('../tests/stories/catalogCard');
  // require as many stories as you need.
}

configure(loadStories, module);
