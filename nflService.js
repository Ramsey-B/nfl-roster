function NflService() {
    //data brought in from api
    var playersData = []
    //user team object
    var userTeam = {
        qb: {
            img: '',
            name: '',
            position: '',
            team: ''
        },
        rb1: {
            img: '',
            name: '',
            position: '',
            team: ''
        },
        rb2: {
            img: '',
            name: '',
            position: '',
            team: ''
        },
        wr1: {
            img: '',
            name: '',
            position: '',
            team: ''
        },
        wr2: {
            img: '',
            name: '',
            position: '',
            team: ''
        },
        wr3: {
            img: '',
            name: '',
            position: '',
            team: ''
        },
        te: {
            img: '',
            name: '',
            position: '',
            team: ''
        },
        dst: {
            img: '',
            name: '',
            position: '',
            team: ''
        },
        k: {
            img: '',
            name: '',
            position: '',
            team: ''
        }

    }
    //api data filtered so it only gives relavent positions
    var filteredData
    //records current search results
    var searchResults
    //stores players removed from search, this could just be userTeam but I changed the object of userTeam so it doesnt match player data any more
    var removedPlayers = []
    //filters data for relavant players
    function filterData(arr) {
        return arr.filter(function (player) {
            switch (player.position) {
                case 'QB':
                case 'RB':
                case 'WR':
                case 'TE':
                case 'DST':
                case 'K':
                    return true
            }
        })
    }
    //retrieves data from api
    function loadPlayersData(cb) {
        //check if the player already has a copy of the NFL playersData
        var localData = localStorage.getItem('playersData');
        //if they do, pull from there
        if (localData) {
            playersData = JSON.parse(localData);
            //return will short-circuit the loadPlayersData function
            //this will prevent the code below from ever executing
            filteredData = cb(playersData)
        }
        //if not go get that data
        var url = "https://bcw-getter.herokuapp.com/?url=";
        var endpointUri = "http://api.cbssports.com/fantasy/players/list?version=3.0&SPORT=football&response_format=json";
        var apiUrl = url + encodeURIComponent(endpointUri);

        $.getJSON(apiUrl, function (data) {
            playersData = data.body.players;
            console.log('Player Data Ready')
            console.log('Writing Player Data to localStorage')
            localStorage.setItem('playersData', JSON.stringify(playersData))
            console.log('Finished Writing Player Data to localStorage')
            filteredData = cb(playersData)
        });
    }
    //finds all players that match team name search 
    this.getPlayersByTeam = function (teamName) {
        return filteredData.filter(function (player) {
            if (player.pro_team == teamName) {
                return true;
            }
        })
    }
    //find player by position
    this.getPlayersByPosition = function (position) {
        return filteredData.filter(function (player) {
            if (player.position == position) {
                return true;
            }
        })
    }
    //find player by name
    this.getPlayersByName = function (name) {
        return filteredData.filter(function (player) {
            //makes players in data same case as search term then checks to see if term is included in players name
            if (player.fullname.toUpperCase().includes(name)) {
                return true;
            }
        })
    }
    //adds player to team arr
    this.addPlayer = function addPlayer(newPlayerId, cb, cb2) {
        //looks through all data to check if a player id matches added players id
        var newPlayer = filteredData.find(function (player) {
            return player.id == newPlayerId
        })
        //checks to see if position is already filled on team
        if (newPlayer.position == 'QB') {
            //cb2 just removes the player from team and adds them back into search results and data, it does that to replace player with newly added
            cb2(userTeam.qb.id)
            //this can be reduced by just pushing the orignal object into userTeam, but i chose to limit the results to just the relevent info
            userTeam.qb.img = newPlayer.photo
            userTeam.qb.name = newPlayer.fullname
            userTeam.qb.position = newPlayer.position
            userTeam.qb.team = newPlayer.pro_team
            userTeam.qb.id = newPlayer.id
        } else if (newPlayer.position == 'RB') {
            if (userTeam.rb1.name == '') {
                userTeam.rb1.img = newPlayer.photo
                userTeam.rb1.name = newPlayer.fullname
                userTeam.rb1.position = newPlayer.position
                userTeam.rb1.team = newPlayer.pro_team
                userTeam.rb1.id = newPlayer.id
            } else {
                cb2(userTeam.rb2.id)
                userTeam.rb2.img = newPlayer.photo
                userTeam.rb2.name = newPlayer.fullname
                userTeam.rb2.position = newPlayer.position
                userTeam.rb2.team = newPlayer.pro_team
                userTeam.rb2.id = newPlayer.id
            }
        } else if (newPlayer.position == 'WR') {
            if (userTeam.wr1.name == '') {
                userTeam.wr1.img = newPlayer.photo
                userTeam.wr1.name = newPlayer.fullname
                userTeam.wr1.position = newPlayer.position
                userTeam.wr1.team = newPlayer.pro_team
                userTeam.wr1.id = newPlayer.id

            } else if (userTeam.wr2.name == '') {
                userTeam.wr2.img = newPlayer.photo
                userTeam.wr2.name = newPlayer.fullname
                userTeam.wr2.position = newPlayer.position
                userTeam.wr2.team = newPlayer.pro_team
                userTeam.wr2.id = newPlayer.id
            } else {
                cb2(userTeam.wr3.id)
                userTeam.wr3.img = newPlayer.photo
                userTeam.wr3.name = newPlayer.fullname
                userTeam.wr3.position = newPlayer.position
                userTeam.wr3.team = newPlayer.pro_team
                userTeam.wr3.id = newPlayer.id
            }
        } else if (newPlayer.position == 'TE') {
            cb2(userTeam.te.id)
            userTeam.te.img = newPlayer.photo
            userTeam.te.name = newPlayer.fullname
            userTeam.te.position = newPlayer.position
            userTeam.te.team = newPlayer.pro_team
            userTeam.te.id = newPlayer.id
        } else if (newPlayer.position == 'DST') {
            cb2(userTeam.dst.id)
            userTeam.dst.img = newPlayer.photo
            userTeam.dst.name = newPlayer.fullname
            userTeam.dst.position = newPlayer.position
            userTeam.dst.team = newPlayer.pro_team
            userTeam.dst.id = newPlayer.id
        } else {
            cb2(userTeam.k.id)
            userTeam.k.img = newPlayer.photo
            userTeam.k.name = newPlayer.fullname
            userTeam.k.position = newPlayer.position
            userTeam.k.team = newPlayer.pro_team
            userTeam.k.id = newPlayer.id
        }
        cb(userTeam)
    }
    //just removes player with matching idea and updates team
    this.removePlayer = function removePlayer(id, cb) {
        var pos = [userTeam.qb, userTeam.rb1, userTeam.rb2, userTeam.wr1, userTeam.wr2, userTeam.wr3, userTeam.te, userTeam.dst, userTeam.k]
        for (let i = 0; i < pos.length; i++) {
            const playerPos = pos[i];
            if (playerPos.id == id) {
                playerPos.name = ''
                playerPos.position = ''
                playerPos.img = ''
                playerPos.userTeam = ''
                playerPos.id = ''
                cb(userTeam)
            }
        }
    }
    //records search results and logs them so i can edit them as players are added or removed
    this.searchRecord = function searchRecord(arr) {
        searchResults = arr
    }
    //removes added player from search results then redraws the results
    this.removeSearch = function removeSearch(playerId, cb) {
        for (let i = 0; i < searchResults.length; i++) {
            const search = searchResults[i];
            if (search.id == playerId) {
                searchResults.splice([i], 1)
            }
        }
        cb(searchResults)
    }
    //removes added player from data so they cant be added again
    this.removeData = function removeData(playerId) {
        for (let i = 0; i < filteredData.length; i++) {
            const data = filteredData[i];
            if (data.id == playerId) {
                removedPlayers.push(filteredData[i])
                filteredData.splice([i], 1)
            }
        }
    }
    //adds player back into search and data and redraws it so that they can be added again
    this.addSearch = function addSearch(playerId, cb) {
        for (let i = 0; i < removedPlayers.length; i++) {
            const add = removedPlayers[i];
            if (add.id == playerId) {
                //removed players just logs the players that have been removed from the search and data
                searchResults.unshift(removedPlayers[i])
                filteredData.unshift(removedPlayers[i])
                removedPlayers.splice([i], 1)
            }
        }
        cb(searchResults)
    }

    loadPlayersData(filterData); //call the function above every time we create a new service
}