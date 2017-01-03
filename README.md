This sumodule contains the UI subsystem from RIFT.ware. The following
section describes the major components of the UI subsystem:

skyquake: contains the entire UI code including the plugin framework, plugins, scripts and tests.
skyquake/skyquake.js: bootstrap module that starts the UI subsystem. It can be invoked using node (node skyquake.js).
skyquake/framework: contains code for the plugin framework, common utilities, common UI components and common styles.
skyquake/plugins: contains API and view code for the plugins including production plugins such as about, accounts, composer, config, debug, launchpad, logging and development plugins including helloworld and goodbyworld.
skyquake/scripts: contains scripts to build, install and launch the UI components. These scripts are called from the RIFT.ware build context.
skyquake/tests: contains the test framework and tests for some of the UI server components.
