[![npm version](https://badge.fury.io/js/togglvest.svg)](https://badge.fury.io/js/togglvest)

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

# Runtime requirements

* NodeJS >= 8.0.0

# Sync Requirements

* Harvest account with Project Manager role
* Harvest Account Id
* Harvest Personal Access Token [https://id.getharvest.com/developers](https://id.getharvest.com/developers)
* Toggl API Token [https://www.toggl.com/app/profile](https://www.toggl.com/app/profile)
* Toggl Tags should be equal to the Harvest Tasks

# Configuration

```
npx togglvest config
```

# Synchronization

## Command options

```
npx togglvest sync <day> <month> <year>
```

## Samples of usage

```
# Curren date
npx togglvest sync

# Day of the current month and year
npx togglvest sync 10

# Day and month of the current year
npx togglvest sync 10 10

# Custom date (day, month, year)
npx togglvest sync 10 10 2017
```
