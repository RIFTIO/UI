import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import CatalogCard from '../../plugins/launchpad/src/instantiate/catalogCard.jsx'
import CatalogDescriptorRaw from '../../plugins/launchpad/src/instantiate/catalogDescriptorRaw.jsx'
import InstantiateDescriptorPanel from '../../plugins/launchpad/src/instantiate/instantiateDescriptorPanel.jsx'
import InstantiateSelectDescriptorPanel from '../../plugins/launchpad/src/instantiate/InstantiateSelectDescriptorPanel.jsx'
import InstantiateInputParams from '../../plugins/launchpad/src/instantiate/instantiateInputParams.jsx'
import reactToJsx from 'react-to-jsx';
import InstantiateStore from '../../plugins/launchpad/src/instantiate/instantiateStore.js';
import Alt from '../../framework/widgets/skyquake_container/skyquakeAltInstance.js'
import {Panel, PanelWrapper} from '../../framework/widgets/panel/panel.jsx'
import '../../node_modules/open-iconic/font/css/open-iconic.css';
import 'style/base.scss';
const Store = Alt.createStore(InstantiateStore)
// import StyleGuideItem from 'react-style-guide';
// import '../../node_modules/react-style-guide/node_modules/highlight.js/styles/github.css';
let SampleNSD = {
  'name': 'A Sample NSD for Corp A',
  'short-name': 'A Sample NSD',
  description: 'A description of the sample NSD',
  vendor: 'RIFT.io',
  version: '1.0',
  "constituent-vnfd": [
      {
          "start-by-default": "true",
          "member-vnf-index": 1,
          "vnfd-id-ref": "358fe806-57f8-11e6-b7de-6cb3113b406f",
          "name": "trafgen",
          "vnf-name": "trafgen"
      },
      {
          "start-by-default": "true",
          "member-vnf-index": 2,
          "vnfd-id-ref": "3bd17356-57f8-11e6-88db-6cb3113b406f",
          "name": "trafsink",
          "vnf-name": "trafsink"
      }
  ],
  "vld": [
      {
          "provider-network": {
              "physical-network": "physnet1",
              "overlay-type": "VLAN"
          },
          "version": "1.0",
          "vendor": "RIFT.io",
          "name": "Link1",
          "short-name": "Link1",
          "vnfd-connection-point-ref": [
              {
                  "vnfd-connection-point-ref": "trafgen/cp0",
                  "vnfd-id-ref": "358fe806-57f8-11e6-b7de-6cb3113b406f",
                  "member-vnf-index-ref": 1
              },
              {
                  "vnfd-connection-point-ref": "trafsink/cp0",
                  "vnfd-id-ref": "3bd17356-57f8-11e6-88db-6cb3113b406f",
                  "member-vnf-index-ref": 2
              }
          ],
          "description": "Link",
          "id": "4ef5eebc-57f8-11e6-87d1-6cb3113b406f",
          "type": "ELAN"
      }
  ],
  "logo": "riftio.png",
  "vnffgd": [
        {
            "name": "vnffgd-1",
            "id": "23ee7",
            "short-name": "FG-1"
        }
    ]
}

storiesOf('Instantiate Components', module)
.add('CatalogCard', () => {
  let cards = [];
  for(let i = 0; i < 10; i++) {
    cards.push(<CatalogCard key={i} clickid={i} descriptor={SampleNSD} />)
  }
  return (
<PanelWrapper>
<Panel>
  <div style={{display:'flex', flexWrap:'wrap'}}>


  <CatalogCard descriptor={SampleNSD} isSelected={true} isActive={true} />
  {
    cards
  }
  </div>
</Panel>
</PanelWrapper>
)}
)

.add('InstantiateDescriptorPanel', () => (
  <PanelWrapper>
    <InstantiateDescriptorPanel
      descriptor={returnNSD()[0]}
    />
    <Panel title="Input Parameters">
    </Panel>
  </PanelWrapper>
))
.add('InstantiateSelectDescriptor', () => (
  <PanelWrapper>
    <InstantiateSelectDescriptorPanel
      descriptors={returnNSD()}
    />
  </PanelWrapper>
))
.add('Descriptor Review', () => (
 <PanelWrapper>
  <Panel title="Select Descriptor">
    <CatalogCard descriptor={SampleNSD} isSelected={true} isActive={true} />
  </Panel>
  <Panel title="Descriptor Preview">
    <CatalogDescriptorRaw descriptor={SampleNSD} />
  </Panel>
</PanelWrapper>))

function returnNSD() {
  return [
            {
                "input-parameter-xpath": [
                    {
                        "xpath": "/nsd:nsd-catalog/nsd:nsd/nsd:vendor"
                    }
                ],
                "ip-profiles": [
                    {
                        "name": "InterVNFLink",
                        "description": "Inter VNF Link",
                        "ip-profile-params": {
                            "ip-version": "ipv4",
                            "gateway-address": "31.31.31.210",
                            "subnet-address": "31.31.31.0/24",
                            "dhcp-params": {
                                "enabled": "true"
                            }
                        }
                    }
                ],
                "version": "1.0",
                "initial-config-primitive": [
                    {
                        "seq": 1,
                        "name": "start traffic",
                        "parameter": [
                            {
                                "name": "userid"
                            }
                        ],
                        "user-defined-script": "start_traffic.py"
                    }
                ],
                "name": "ping_pong_nsd",
                "short-name": "ping_pong_nsd",
                "id": "1b85e414-630c-11e6-9050-3eca272c7412",
                "logo": "rift_logo.png",
                "description": "Toy NS",
                "constituent-vnfd": [
                    {
                        "member-vnf-index": 1,
                        "vnfd-id-ref": "1b84ecbc-630c-11e6-9050-3eca272c7412",
                        "start-by-default": "true",
                        "name": "ping_vnfd",
                        "vnf-name": "ping_vnfd"
                    },
                    {
                        "member-vnf-index": 2,
                        "vnfd-id-ref": "1b859c48-630c-11e6-9050-3eca272c7412",
                        "start-by-default": "true",
                        "name": "pong_vnfd",
                        "vnf-name": "pong_vnfd"
                    }
                ],
                "vendor": "RIFT.io",
                "placement-groups": [
                    {
                        "member-vnfd": [
                            {
                                "member-vnf-index-ref": 1,
                                "vnfd-id-ref": "1b84ecbc-630c-11e6-9050-3eca272c7412",
                                "name": "ping_vnfd"
                            },
                            {
                                "member-vnf-index-ref": 2,
                                "vnfd-id-ref": "1b859c48-630c-11e6-9050-3eca272c7412",
                                "name": "pong_vnfd"
                            }
                        ],
                        "name": "Orcus",
                        "requirement": "Place this VM on the Kuiper belt object Orcus",
                        "strategy": "COLOCATION",
                        "host-aggregate": []
                    },
                    {
                        "member-vnfd": [
                            {
                                "member-vnf-index-ref": 1,
                                "vnfd-id-ref": "1b84ecbc-630c-11e6-9050-3eca272c7412",
                                "name": "ping_vnfd"
                            },
                            {
                                "member-vnf-index-ref": 2,
                                "vnfd-id-ref": "1b859c48-630c-11e6-9050-3eca272c7412",
                                "name": "pong_vnfd"
                            }
                        ],
                        "name": "Quaoar",
                        "requirement": "Place this VM on the Kuiper belt object Quaoar",
                        "strategy": "COLOCATION",
                        "host-aggregate": []
                    }
                ],
                "vld": [
                    {
                        "type": "ELAN",
                        "description": "Toy VL",
                        "version": "1.0",
                        "ip-profile-ref": "InterVNFLink",
                        "vendor": "RIFT.io",
                        "name": "ping_pong_vld",
                        "short-name": "ping_pong_vld",
                        "id": "ping_pong_vld1",
                        "vnfd-connection-point-ref": [
                            {
                                "member-vnf-index-ref": 1,
                                "vnfd-id-ref": "1b84ecbc-630c-11e6-9050-3eca272c7412",
                                "vnfd-connection-point-ref": "ping_vnfd/cp0"
                            },
                            {
                                "member-vnf-index-ref": 2,
                                "vnfd-id-ref": "1b859c48-630c-11e6-9050-3eca272c7412",
                                "vnfd-connection-point-ref": "pong_vnfd/cp0"
                            }
                        ]
                    }
                ],
                "meta": {
                    "instance-ref-count": 1
                },
                "ns-placement-groups": [
                    {
                        "member-vnfd": [
                            {
                                "member-vnf-index-ref": 1,
                                "vnfd-id-ref": "1b84ecbc-630c-11e6-9050-3eca272c7412",
                                "name": "ping_vnfd"
                            },
                            {
                                "member-vnf-index-ref": 2,
                                "vnfd-id-ref": "1b859c48-630c-11e6-9050-3eca272c7412",
                                "name": "pong_vnfd"
                            }
                        ],
                        "name": "Orcus",
                        "requirement": "Place this VM on the Kuiper belt object Orcus",
                        "strategy": "COLOCATION",
                        "host-aggregate": []
                    },
                    {
                        "member-vnfd": [
                            {
                                "member-vnf-index-ref": 1,
                                "vnfd-id-ref": "1b84ecbc-630c-11e6-9050-3eca272c7412",
                                "name": "ping_vnfd"
                            },
                            {
                                "member-vnf-index-ref": 2,
                                "vnfd-id-ref": "1b859c48-630c-11e6-9050-3eca272c7412",
                                "name": "pong_vnfd"
                            }
                        ],
                        "name": "Quaoar",
                        "requirement": "Place this VM on the Kuiper belt object Quaoar",
                        "strategy": "COLOCATION",
                        "host-aggregate": []
                    }
                ],
                "vnf-placement-groups": [
                    {
                        "name": "Eris",
                        "member-vdus": [
                            {
                                "member-vdu-ref": "iovdu_0"
                            }
                        ],
                        "requirement": "Place this VM on the Kuiper belt object Eris",
                        "strategy": "COLOCATION",
                        "host-aggregate": [],
                        "vnf-name": "ping_vnfd",
                        "vnfd-id-ref": "1b84ecbc-630c-11e6-9050-3eca272c7412",
                        "member-vnf-index": 1
                    },
                    {
                        "name": "Weywot",
                        "member-vdus": [
                            {
                                "member-vdu-ref": "iovdu_0"
                            }
                        ],
                        "requirement": "Place this VM on the Kuiper belt object Weywot",
                        "strategy": "COLOCATION",
                        "host-aggregate": [],
                        "vnf-name": "pong_vnfd",
                        "vnfd-id-ref": "1b859c48-630c-11e6-9050-3eca272c7412",
                        "member-vnf-index": 2
                    }
                ]
            },
            {
                "input-parameter-xpath": [
                    {
                        "xpath": "/nsd:nsd-catalog/nsd:nsd/nsd:vendor"
                    }
                ],
                "ip-profiles": [
                    {
                        "name": "InterVNFLink",
                        "description": "Inter VNF Link",
                        "ip-profile-params": {
                            "ip-version": "ipv4",
                            "gateway-address": "31.31.31.210",
                            "subnet-address": "31.31.31.0/24",
                            "dhcp-params": {
                                "enabled": "true"
                            }
                        }
                    }
                ],
                "version": "1.0",
                "initial-config-primitive": [
                    {
                        "seq": 1,
                        "name": "start traffic",
                        "parameter": [
                            {
                                "name": "userid"
                            }
                        ],
                        "user-defined-script": "start_traffic.py"
                    }
                ],
                "name": "a copy of pingpong",
                "meta": {
                    "containerPositionMap": {
                        "1": {
                            "top": 130,
                            "left": 260,
                            "right": 510,
                            "bottom": 185,
                            "width": 250,
                            "height": 55
                        },
                        "2": {
                            "top": 130,
                            "left": 635,
                            "right": 885,
                            "bottom": 185,
                            "width": 250,
                            "height": 55
                        },
                        "e0d7f471-ade0-49d3-9f47-225aa724ae08": {
                            "top": 30,
                            "left": 135,
                            "right": 385,
                            "bottom": 85,
                            "width": 250,
                            "height": 55
                        },
                        "ping_pong_vld1": {
                            "top": 300,
                            "left": 447.5,
                            "right": 697.5,
                            "bottom": 338,
                            "width": 250,
                            "height": 38
                        }
                    },
                    "instance-ref-count": 0
                },
                "short-name": "ping_pong_nsd",
                "id": "e0d7f471-ade0-49d3-9f47-225aa724ae08",
                "logo": "rift_logo.png",
                "description": "Toy NS",
                "constituent-vnfd": [
                    {
                        "member-vnf-index": 1,
                        "vnfd-id-ref": "1b84ecbc-630c-11e6-9050-3eca272c7412",
                        "start-by-default": "true",
                        "name": "ping_vnfd",
                        "vnf-name": "ping_vnfd"
                    },
                    {
                        "member-vnf-index": 2,
                        "vnfd-id-ref": "1b859c48-630c-11e6-9050-3eca272c7412",
                        "start-by-default": "true",
                        "name": "pong_vnfd",
                        "vnf-name": "pong_vnfd"
                    }
                ],
                "vendor": "RIFT.io",
                "placement-groups": [
                    {
                        "member-vnfd": [
                            {
                                "member-vnf-index-ref": 1,
                                "vnfd-id-ref": "1b84ecbc-630c-11e6-9050-3eca272c7412",
                                "name": "ping_vnfd"
                            },
                            {
                                "member-vnf-index-ref": 2,
                                "vnfd-id-ref": "1b859c48-630c-11e6-9050-3eca272c7412",
                                "name": "pong_vnfd"
                            }
                        ],
                        "name": "Orcus",
                        "requirement": "Place this VM on the Kuiper belt object Orcus",
                        "strategy": "COLOCATION",
                        "host-aggregate": []
                    },
                    {
                        "member-vnfd": [
                            {
                                "member-vnf-index-ref": 1,
                                "vnfd-id-ref": "1b84ecbc-630c-11e6-9050-3eca272c7412",
                                "name": "ping_vnfd"
                            },
                            {
                                "member-vnf-index-ref": 2,
                                "vnfd-id-ref": "1b859c48-630c-11e6-9050-3eca272c7412",
                                "name": "pong_vnfd"
                            }
                        ],
                        "name": "Quaoar",
                        "requirement": "Place this VM on the Kuiper belt object Quaoar",
                        "strategy": "COLOCATION",
                        "host-aggregate": []
                    }
                ],
                "vld": [
                    {
                        "type": "ELAN",
                        "description": "Toy VL",
                        "version": "1.0",
                        "vendor": "RIFT.io",
                        "name": "ping_pong_vld",
                        "short-name": "ping_pong_vld",
                        "id": "ping_pong_vld1",
                        "vnfd-connection-point-ref": [
                            {
                                "member-vnf-index-ref": 1,
                                "vnfd-id-ref": "1b84ecbc-630c-11e6-9050-3eca272c7412",
                                "vnfd-connection-point-ref": "ping_vnfd/cp0"
                            },
                            {
                                "member-vnf-index-ref": 2,
                                "vnfd-id-ref": "1b859c48-630c-11e6-9050-3eca272c7412",
                                "vnfd-connection-point-ref": "pong_vnfd/cp0"
                            }
                        ]
                    }
                ],
                "ns-placement-groups": [
                    {
                        "member-vnfd": [
                            {
                                "member-vnf-index-ref": 1,
                                "vnfd-id-ref": "1b84ecbc-630c-11e6-9050-3eca272c7412",
                                "name": "ping_vnfd"
                            },
                            {
                                "member-vnf-index-ref": 2,
                                "vnfd-id-ref": "1b859c48-630c-11e6-9050-3eca272c7412",
                                "name": "pong_vnfd"
                            }
                        ],
                        "name": "Orcus",
                        "requirement": "Place this VM on the Kuiper belt object Orcus",
                        "strategy": "COLOCATION",
                        "host-aggregate": []
                    },
                    {
                        "member-vnfd": [
                            {
                                "member-vnf-index-ref": 1,
                                "vnfd-id-ref": "1b84ecbc-630c-11e6-9050-3eca272c7412",
                                "name": "ping_vnfd"
                            },
                            {
                                "member-vnf-index-ref": 2,
                                "vnfd-id-ref": "1b859c48-630c-11e6-9050-3eca272c7412",
                                "name": "pong_vnfd"
                            }
                        ],
                        "name": "Quaoar",
                        "requirement": "Place this VM on the Kuiper belt object Quaoar",
                        "strategy": "COLOCATION",
                        "host-aggregate": []
                    }
                ],
                "vnf-placement-groups": [
                    {
                        "name": "Eris",
                        "member-vdus": [
                            {
                                "member-vdu-ref": "iovdu_0"
                            }
                        ],
                        "requirement": "Place this VM on the Kuiper belt object Eris",
                        "strategy": "COLOCATION",
                        "host-aggregate": [],
                        "vnf-name": "ping_vnfd",
                        "vnfd-id-ref": "1b84ecbc-630c-11e6-9050-3eca272c7412",
                        "member-vnf-index": 1
                    },
                    {
                        "name": "Weywot",
                        "member-vdus": [
                            {
                                "member-vdu-ref": "iovdu_0"
                            }
                        ],
                        "requirement": "Place this VM on the Kuiper belt object Weywot",
                        "strategy": "COLOCATION",
                        "host-aggregate": [],
                        "vnf-name": "pong_vnfd",
                        "vnfd-id-ref": "1b859c48-630c-11e6-9050-3eca272c7412",
                        "member-vnf-index": 2
                    }
                ]
            }
        ];
}
