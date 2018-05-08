function NflService() {
    //data brought in from api
    var playersData = []
    //user team object
    var userTeam = []
    var avalPositions = ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'DST', 'K']
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
    function getPlayersById(id) {
        return userTeam.filter(function (player) {
            if (player.id == id) {
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
    this.addPlayer = function addPlayer(newPlayerId, cb) {
        //looks through all data to check if a player id matches added players id
        var newPlayer = searchResults.find(function (player) {
            return player.id == newPlayerId
        })
        if (avalPositions.includes(newPlayer.position)) {
            userTeam.unshift(newPlayer)
            var index = avalPositions.indexOf(newPlayer.position)
            avalPositions.splice(index, 1)
            addedPlayers.push(newPlayer.id)
        } else {
            var teamPlayer = userTeam.find(player => {
                return player.position == newPlayer.position
            })
            searchResults.unshift(teamPlayer)
            var index = addedPlayers.indexOf(teamPlayer.id)
            addedPlayers.splice(index, 1)
            var playIndex = userTeam.indexOf(teamPlayer)
            userTeam.splice(playIndex, 1, newPlayer)
            addedPlayers.push(newPlayer.id)
        }
        cb(userTeam)
    }
    //just removes player with matching idea and updates team
    this.removePlayer = function removePlayer(id, cb) {
        for (let i = 0; i < userTeam.length; i++) {
            const player = userTeam[i];
            avalPositions.push(player.position)
            userTeam.splice([i], 1)
        }
        var idStr = '' + id
        var index = addedPlayers.indexOf(idStr)
        addedPlayers.splice(index, 1)
        cb(userTeam)
    }
    this.searchRecord = function searchRecord(arr) {
        var search = []
        for (let i = 0; i < arr.length; i++) {
            const player = arr[i];
            if (!(addedPlayers.includes(player.id))) {
                search.push(player)
            }
        }
        searchResults = search
        return search
    }
    //redraws search
    this.removeSearch = function removeSearch(cb) {
        var newResults = this.searchRecord(searchResults)
        cb(searchResults)
    }
    //adds player back into search and data and redraws it so that they can be added again
    this.addSearch = function addSearch(playerId, cb) {
        var player = getPlayersById(playerId)
        // removeAddedPlayer(playerId)
        searchResults.unshift(player[0])
        cb(searchResults)
    }

    loadPlayersData(filterData); //call the function above every time we create a new service
}