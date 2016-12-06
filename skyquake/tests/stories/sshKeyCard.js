import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import DashboardCard from '../../framework/widgets/dashboard_card/dashboard_card.jsx'
import SshKeyCard from '../../plugins/launchpad/src/ssh_keys/sshKeyCard.jsx';
import SshKeys from '../../plugins/launchpad/src/ssh_keys/sshKeys.jsx';
import SshKeyStore from '../../plugins/launchpad/src/ssh_keys/sshKeyStore.js';
import Alt from '../../framework/widgets/skyquake_container/skyquakeAltInstance.js'
import reactToJsx from 'react-to-jsx';
import '../../node_modules/open-iconic/font/css/open-iconic.css';
import 'style/base.scss';
// import StyleGuideItem from 'react-style-guide';
// import '../../node_modules/react-style-guide/node_modules/highlight.js/styles/github.css';

const Store = Alt.createStore(SshKeyStore)

storiesOf('CatalogCard', module)
// .add('page', () => (<SshKeys />))
.add('sshKeyPage', () => (<Test />))


class Test extends React.Component {
  constructor() {
    super();
    let self = this;
    this.state = Store.getState();
    console.log(this.state)
    Store.listen(function(data) {
      self.setState({data: data.data})
    })
  }
  render() {
    let self = this;
    return (
      <DashboardCard>
        {
          self.state.data && self.state.data.keys.map(function(k, i) {
            let sshKey = self.state.data.entities[k];
            return (
              <SshKeyCard key={i}  name={sshKey.name} value={sshKey.key}
              editMode={sshKey.isEditable}
              editKey= {Store.editSshKeyPair(sshKey.name)}
              updateSshKeyPair={Store.updateSshKeyPair}
              cancelEditSshKeyPair={Store.cancelEditSshKeyPair}
              saveEditSshKeyPair={Store.saveEditSshKeyPair(sshKey.name)}
              />
            )
          })
        }
      </DashboardCard>
    )
  }
}
