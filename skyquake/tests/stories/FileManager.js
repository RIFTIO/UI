import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import reactToJsx from 'react-to-jsx';

import FileManager from '../../plugins/composer/src/src/components/filemanager/FileManager.jsx';

import '../../node_modules/open-iconic/font/css/open-iconic.css';
import 'style/base.scss';


storiesOf('File Manager', module)
    .add('File Manager', () => {
        return (
                <div style={{backgroundColor: '#e5e5e5',height:'100%', position:'absolute', top: 0, left: 0, right: 0, bottom:0}}>
            <FileManager/>
            </div>
        )
    })

