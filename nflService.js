function NflService() {
    //data brought in from api
    var playersData = []
    //user team object
    var userTeam = {
        qb: {},
        rb1: {},
        rb2: {},
        wr1: {},
        wr2: {},
        wr3: {},
        te: {},
        dst: {},
        k: {}

    }
    //api data filtered so it only gives relavent positions
    var filteredData
    //records current search results
    var searchResults
    //stores players removed from search, this could just be userTeam but I changed the object of userTeam so it doesnt match player data any more
    var addedPlayers = []
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
            playersData = data.body.players.map(player => ({
                img: player.photo,
                name: player.fullname,
                position: player.position,
                team: player.pro_team,
                id: player.id,
            }));
            console.log(playersData)
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
            if (player.team == teamName) {
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
            if (player.name.toUpperCase().includes(name)) {
                return true;
            }
        })
    }
    //adds player to team arr
    this.addPlayer = function addPlayer(newPlayerId, cb, cb2) {
        //looks through all data to check if a player id matches added players id
        var newPlayer = searchResults.find(function (player) {
            return player.id == newPlayerId
        })

        switch (newPlayer.position) {
            case "QB":
            case "TE":
            case "DST":
            case "K":
                cb2(userTeam[newPlayer.position.toLowerCase()].id)
                userTeam[newPlayer.position.toLowerCase()] = newPlayer
                addedPlayers.push(newPlayer)
                break;
            case "RB":
                if (userTeam.rb1.name == '') {
                    userTeam.rb1 = newPlayer
                    addedPlayers.push(newPlayer)
                } else {
                    cb2(userTeam.rb2.id)
                    userTeam.rb2 = newPlayer
                    addedPlayers.push(newPlayer)
                }
                break;
            case "WR":
                if (userTeam.wr1.name == '') {
                    userTeam.wr1 = newPlayer
                    addedPlayers.push(newPlayer)

                } else if (userTeam.wr2.name == '') {
                    userTeam.wr2 = newPlayer
                    addedPlayers.push(newPlayer)
                } else {
                    cb2(userTeam.wr3.id)
                    userTeam.wr3 = newPlayer
                    addedPlayers.push(newPlayer)
                }
                break;
        }


        //checks to see if position is already filled on team
        // if (newPlayer.position == 'QB') {
        //     //cb2 just removes the player from team and adds them back into search results and data, it does that to replace player with newly added
        //     cb2(userTeam.qb.id)
        //     //this can be reduced by just pushing the orignal object into userTeam, but i chose to limit the results to just the relevent info
        //     userTeam.qb = newPlayer
        //     addedPlayers.push(newPlayer)
        // } else if (newPlayer.position == 'RB') {
        //     if (userTeam.rb1.name == '') {
        //         userTeam.rb1 = newPlayer
        //         addedPlayers.push(newPlayer)
        //     } else {
        //         cb2(userTeam.rb2.id)
        //         userTeam.rb2 = newPlayer
        //         addedPlayers.push(newPlayer)
        //     }
        // } else if (newPlayer.position == 'WR') {
        //     if (userTeam.wr1.name == '') {
        //         userTeam.wr1 = newPlayer
        //         addedPlayers.push(newPlayer)

        //     } else if (userTeam.wr2.name == '') {
        //         userTeam.wr2 = newPlayer
        //         addedPlayers.push(newPlayer)
        //     } else {
        //         cb2(userTeam.wr3.id)
        //         userTeam.wr3 = newPlayer
        //         addedPlayers.push(newPlayer)
        //     }
        // } else if (newPlayer.position == 'TE') {
        //     cb2(userTeam.te.id)
        //     userTeam.te = newPlayer
        //     addedPlayers.push(newPlayer)
        // } else if (newPlayer.position == 'DST') {
        //     cb2(userTeam.dst.id)
        //     userTeam.dst = newPlayer
        //     addedPlayers.push(newPlayer)
        // } else {
        //     cb2(userTeam.k.id)
        //     userTeam.k = newPlayer
        //     addedPlayers.push(newPlayer)
        // }
        cb(userTeam)
    }
    //just removes player with matching idea and updates team
    this.removePlayer = function removePlayer(id, cb) {
        for (var key in userTeam) {
            if (userTeam[key].id == id) {
                userTeam[key] = {}
            }
        }
        cb(userTeam)
    }
    //records search results and logs them so i can edit them as players are added or removed
    this.searchRecord = function searchRecord(arr) {
        var search = []
        for (let i = 0; i < arr.length; i++) {
            const player = arr[i];
            if (!(addedPlayers.includes(player))) {
                search.push(player)
            }
        }
        searchResults = search
    }
    //redraws search
    this.removeSearch = function removeSearch(cb) {
        var newResults = this.searchRecord(searchResults)
        cb(searchResults)
    }
    //adds player back into search and data and redraws it so that they can be added again
    this.addSearch = function addSearch(playerId, cb) {
        for (let i = 0; i < addedPlayers.length; i++) {
            const add = addedPlayers[i];
            if (add.id == playerId) {
                //added players just logs the players that have been added from the search and data
                searchResults.unshift(addedPlayers[i])
                filteredData.unshift(addedPlayers[i])
                addedPlayers.splice([i], 1)
            }
        }
        cb(searchResults)
    }

    loadPlayersData(filterData); //call the function above every time we create a new service
}