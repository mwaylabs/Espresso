NOTE
====

This is the development branch of Espresso, and heavily under construction!

Espresso README
===============

Espresso: The-M-Projects build tools using node.js


Installation
============

Prerequesites
-------------

To install espresso you need [Node.js](http://nodejs.org/) >= 0.4 and either git or npm.

Install via NPM
----------------

You can install espresso with the help of [NPM](http://npmjs.org/):

    npm install espresso -g

The "-g" option is needed for npm >= 1.0.

Install via git
---------------

If you don't want to use NPM, you can check out the project with git, init the submodules and create an alias.

1. Install node.js. see description [here](http://nodejs.org/#download)
2. Checkout Espresso:

    `git clone https://github.com/mwaylabs/Espresso.git`

3. Initialize submodules:

    `git submodule update --init`

4. Create an alias:

    `alias espresso='/path/to/Espresso/bin/espresso.js'`

Usage
=====

1. Create a new HelloWorld project:
    
    `espresso init --project HelloWorld --example`

2. Build it:
    
    `cd HelloWorld && espresso build`

3. Run the development server:

    `espresso server`

4. Generate new files

    `espresso generate -c testcontroller -v testview -m testmodel`

This command will generate a new model, a new view and a new controller.

Installing node.js on Windows
=============================

Read the instructions [here](https://github.com/ry/node/wiki/Building-node.js-on-Cygwin-%28Windows%29)

Licensing
=========

All license information about Espresso and used third-party components can be found in the LICENSE file,
Or in the concrete third-party component.
