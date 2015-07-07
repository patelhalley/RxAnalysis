#RxAnalysis

[The Project Performance Company, LLC (PPC)](http://www.ppc.com/) prototype is entitled [RxAnalysis](http://rxanalysis.herokuapp.com). This research prototype was built using [Open FDA API](https://open.fda.gov) and [NLM DAILYMED API](https://dailymed.nlm.nih.gov) to educate consumers about their drug’s Label, Enforcement and Adverse Events. The intent is that after using this site, consumers will gain knowledge about:
- Information conveyed via a drug’s label.
- Historical and On-going Enforcement/Recall for the given drug.
- Historical Adverse Events occurred by the consumption of the given drug. 

PPC employs a responsive and proactive project management approach that includes a dedicated and professional staff and comprehensive program management (PM) tools to all our engagements. Our PM approach is founded on such principles as the Project Management Institute’s (PMI) Program Management Body of Knowledge (PMBOK), the Software Engineering Institute’s CMMI Maturity Level 3, and ISO 9001:2008 quality standards. The framework includes policies, procedures, templates, guidebooks, and checklists for managing our IT projects successfully. This approach was leveraged for developing the RxAnalysis prototype. Our Product Manager served as the PM/Product Owner and oversaw our team of personnel across 6 ADS positions as identified in Attachment C.

We selected a multidisciplinary team and assigned a leader (Technical Architect) to oversee our Agile approach that used these tools and technologies, which exceeded the minimum five modern and open-source technologies:
  - HTML
  - CSS
  - Twitter Bootstrap 3.3.*
  - Font Awesome 4.3.*
  - Angular JS 1.3.*
  - Underscore.js 1.8.*
  - Chart.js 1.0.*
  - Nodejs 0.12.*

We developed these tools/technologies on our chosen hosting platform as a service (PaaS), Heroku.

####The PPC Development Approach
This prototype was developed following Agile development practices. Work was divided into 5 sprints – each spanning approximately 1 day, and incorporated an iterative approach to development, review and feedback, testing, and incorporating changes in the following sprint. Below are the details for each sprint.

####Sprint 1: Brain Storming Session
- The development team gathered in a closed room. 
- Each team members came up with multiple ideas.
- The team decided on the most suitable ideas based on the development timeframe. 
- The team agreed on the requirements, which were compiled in the requirements document as the output of the session.
- All remaining sprints were planned and the team agreed upon the tasks to be done in each sprint along with the owner of each task.

####Sprint 2: Design, Tools Selection & Base Architecture Development
- The User Experience (UX) developer (Visual Designer) took the requirements document and worked on the user interface (UI) design.
- The DevOps team, consisting of our Technical Architect, Interaction Designer/User Researcher/Usability Tester, Front End Web Developer and DevOps Engineer – met and decided upon the open source technologies and coding design pattern to be used for development.
- The output of Sprint 2 was a PhotoShop document (psd) design style guide which incorporated feedback and was based on the architecture which was reviewed by the team.

####Sprint 3: Development, Deployment, Test Plan Creation, and Test Plan Review
- Taking the design style guide (psd) and base architecture as inputs, more features were developed as part of this sprint.
- Output of the sprint was a partially working prototype which was deployed to the development environment.
- The QA Team created the test plan, which was reviewed by the team.

####Sprint 4: Development, Deployment & Testing
- More features were developed as part of this sprint and continuous deployment using the Automatic Deploy feature were accomplished.
- Full functional testing and regression testing were performed and issues were logged and tracked using GitHub’s issue tracking system.

####Sprint 5: Development, Bug Fixing, Deployment & Testing
- Minor pending features were developed. 
- Issues were also fixed.
- The fully integrated prototype was verified as part of User Acceptance Testing (UAT) and the Product Manager (Product Owner) signed off on the product.

The result is the RxAnalysis prototype based on openly-licensed and free of charge tools and technologies.

How the PPC RxAnalysis Prototype Works
The RxAnalysis pages consist of static HTML/CSS/JS content. Data is served to a user interface (UI) via a JSON-based API built using Nodejs. AngularJS is used for requesting dynamic data from server and modifying HTML DOM elements.

Our Project Structure defines the way we placed the code by folders:
- micro_services: contains easily rewritable multiple micro-services
   - common: contains common and utility functions that can be used across different modules
   - drug: 
      - enforcement: contains functions and API related to enforcement/recall for the drug
      - event: contains functions and API related to adverse events for the drug
      - label: contains functions and API related to labeling information for the drug
   - state: contains API related to states of the USA
- public: global public content exposed for end consumers
   - controllers: contains AngularJS controllers for different HTML pages
   - css: contains common stylesheets 
   - img: contains common images (e.g., background, logo)
   - views: contains static HTML pages embedded with AngularJS directives
- test: contains unit tests.
- index.js  (site start file)
- package.json: contains reference to project dependencies and other required configuration items

A prerequisite for anyone trying to use our code includes:
Node 0.12.* 

All the dependencies are managed with the package manager tool [npm](https://www.npmjs.com) in the parent directory's [package.json](https://github.com/patelhalley/RxAnalysis/blob/master/package.json).

####Testing
Unit test for site can be performed using [Mocha](http://mochajs.org/).

To install Mocha execute following command at the root directory of the site
```
npm install mocha -g
```
To execute unit test execute following command at the root directory of the site:
```
mocha test
```

####Site Deployment
To deploy the site to http://rxanalysis.herokuapp.com/ , the user will need:
- Access to the https://heroku.com service account.
- Access to the https://github.com and repository having the latest code.

####Site Deployment Process
- From Heroku dashboard, Select RxAnalysis from the ‘Personal Apps’ section. If the app does not exist, add the new app and select it.
- Navigate to Deploy section.
- Connect to GitHub and select main branch to be deployed.
- Optionally, Automatic Deploys upon code commit can be enabled; this will automatically push the latest changes to production upon code commit to source control.
- Click ‘Deploy Branch’ to deploy the app.

Note: All these steps can also be performed via the command prompt. For more details, please refer to [Heroku Dev Center](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction).

####Site Security
Since this site is public facing and does not have any direct database association, no explicit security measures are required.


