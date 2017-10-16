[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

# Requirements

* Harvest Account Id and Personal Access Token [https://id.getharvest.com/developers](https://id.getharvest.com/developers)

* Toggl API Token [https://www.toggl.com/app/profile](https://www.toggl.com/app/profile)

* Toggl Tags should be equal to the Harvest Tasks

# Install

```
npm install -g togglvest
```

# Configuration

```
togglvest config
```

# Synchronization

## Command options

```
togglvest sync <day> <month> <year>
```

## Samples of usage

```
# Curren date
togglvest sync

# Day of the current month and year
togglvest sync 10

# Day and month of the current year
togglvest sync 10 10

# Custom date (day, month, year)
togglvest sync 10 10 2017
```