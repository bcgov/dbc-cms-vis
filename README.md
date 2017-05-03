# dbc-cms-vis

staging for embeddable interactive visualizations, released production in GitHub
https://github.com/bcgov/dbc-cms-vis/ 

## How to embedd Tables and Visualizations to CMS Lite
## All visualizations are required to source the data from the [BC Data Catalogue](https://catalogue.data.gov.bc.ca/dataset)

These instructions assume you have a gogs and github account and that you have a basic knowledge of git. You can create a gogs account at https://gogs.data.gov.bc.ca. For info on git see http://rogerdudler.github.io/git-guide/.

Every table or visualization first needs to be added to our test environment (QA) that is not publically viewable, before it is approved and is moved to the production environment (Prod). 

## QA environment
Visualizations in QA are contained in a gogs repo - https://gogs.data.gov.bc.ca/DataBC/dbc-cms-vis and displayed here - https://qa-galleries.data.gov.bc.ca/$PACKAGE_ID-vis#/. 

To add new a visualizaiton to this repo:
- Fork https://gogs.data.gov.bc.ca/DataBC/dbc-cms-vis
- create a new directory using the UID of the BC Data Catalogue record holding your data
- add your index.html file and other dependency files (e.g. css) needed to the direcotry
- commit your changes and push to your gogs fork
- submit a pull request (PR) to https://gogs.data.gov.bc.ca/DataBC/dbc-cms-vis
- Once merged your visualization will be visible (on the government network) here: https://qa-galleries.data.gov.bc.ca/YOUR_DIRECTORY_UID-vis#

You can now embed the url of your visualiation https://qa-galleries.data.gov.bc.ca/$PACKAGE_ID-vis#/ in your QA CMS Lite page. 

## Production Environment
Once you have finsihed developing in the QA environment you will add your visualization to the production repo on github - https://github.com/bcgov/dbc-cms-vis

As you did for QA, fork the repo, add your new directory and commit your files and submit a PR to merge. Once your PR has been merged your visualization will be publically visible at https://galleries.data.gov.bc.ca/$PACKAGE_ID-vis#. You can embed these in your produciton CMS Lite page.
