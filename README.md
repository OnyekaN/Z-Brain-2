# Z-Brain Atlas (2019)

- [Repo Contents](#repo-contents)
- [External Resources](#external-resources)

![zbrain diagram image](https://github.com/OnyekaN/Z-Brain-2/blob/master/app/assets/images/FrontPageImage.jpg)

## Repo Contents

- [**app**](https://github.com/OnyekaN/Z-Brain-2/tree/master/app)
contains js scripts for the frontend (AngularJS). **assets** contains static files, **common** contains controllers.

- [**bin**](https://github.com/OnyekaN/Z-Brain-2/tree/master/bin) launches the Express server (bin/www).  To launch, use `npm start` for simple node server, `npm run devel` for **nodemon** development server, or `npm run prod` for node server with production 'env'.

- [**db**](https://github.com/OnyekaN/Z-Brain-2/tree/master/db) contains **Jupyter notebooks** for a.) creation of stack/region/channel images and  b.) **PostgreSQL** database management

- [**node_modules**](https://github.com/OnyekaN/Z-Brain-2/tree/master/node_modules) has **npm** dependencies

- [**routes**](https://github.com/OnyekaN/Z-Brain-2/tree/master/routes) has controllers for Express backend

- **_misc. files_**
    - **image_modify.py** - (deprecated) script for adjusting (line) stack white-levels
    - **initial_slices.py** - (replaces **image_modify.py**), outputs the first slices of white-level adjusted stacks for immediate display
    - **remaining_slies.py** - output remaining slices of white-level adjusted stack
    - **package.json** - info file for node.js ecosystem. Dependencies, scripts, etc.


## External Resources

- [**Z-Brain (Matlab) on Github**](https://github.com/owenrandlett/Z-Brain) - To download MAPMap, viewer & analysis scripts

- [**(Randlett et al., 2015)**](http://www.nature.com/nmeth/journal/v12/n11/abs/nmeth.3581.html) *Paper Abstract* - In order to localize the neural circuits involved in generating behaviors, it is necessary to assign activity onto anatomical maps of the nervous system. Using brain registration across hundreds of larval zebrafish, we have built an expandable open-source atlas containing molecular labels and definitions of anatomical regions, the Z-Brain [...].



