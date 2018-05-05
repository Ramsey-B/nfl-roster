function NflService() {
    var playersData = []
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
    var filteredData
    var searchResults
    var removedPlayers = []

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

    this.getPlayersByTeam = function (teamName) {
        return filteredData.filter(function (player) {
            if (player.pro_team == teamName) {
                return true;
            }
        })
    }

    this.getPlayersByPosition = function (position) {
        return filteredData.filter(function (player) {
            if (player.position == position) {
                return true;
            }
        })
    }

    this.getPlayersByName = function (name) {
        return filteredData.filter(function (player) {
            if (player.fullname.toUpperCase().includes(name)) {
                return true;
            }
        })
    }

    this.addPlayer = function addPlayer(newPlayerId, cb) {
        var newPlayer = filteredData.find(function (player) {
            return player.id == newPlayerId
        })

        if (newPlayer.position == 'QB') {
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
                userTeam.wr3.img = newPlayer.photo
                userTeam.wr3.name = newPlayer.fullname
                userTeam.wr3.position = newPlayer.position
                userTeam.wr3.team = newPlayer.pro_team
                userTeam.wr3.id = newPlayer.id
            }
        } else if (newPlayer.position == 'TE') {
            userTeam.te.img = newPlayer.photo
            userTeam.te.name = newPlayer.fullname
            userTeam.te.position = newPlayer.position
            userTeam.te.team = newPlayer.pro_team
            userTeam.te.id = newPlayer.id
        } else if (newPlayer.position == 'DST') {
            userTeam.dst.img = newPlayer.photo
            userTeam.dst.name = newPlayer.fullname
            userTeam.dst.position = newPlayer.position
            userTeam.dst.team = newPlayer.pro_team
            userTeam.dst.id = newPlayer.id
        } else {
            userTeam.k.img = newPlayer.photo
            userTeam.k.name = newPlayer.fullname
            userTeam.k.position = newPlayer.position
            userTeam.k.team = newPlayer.pro_team
            userTeam.k.id = newPlayer.id
        }
        cb(userTeam)
    }

    this.removePlayer = function removePlayer(num, cb) {
        var pos = [userTeam.qb, userTeam.rb1, userTeam.rb2, userTeam.wr1, userTeam.wr2, userTeam.wr3, userTeam.te, userTeam.dst, userTeam.k]
        var type = pos[num]
        type.name = ''
        type.position = ''
        type.img = ''
        type.userTeam = ''
        type.id = ''
        cb(userTeam)
    }

    this.searchRecord = function searchRecord(arr) {
        searchResults = arr
    }

    this.removeSearch = function removeSearch(playerId, cb) {
        for (let i = 0; i < searchResults.length; i++) {
            const search = searchResults[i];
            if (search.id == playerId) {
                searchResults.splice([i], 1)
            }
        }
        cb(searchResults)
    }

    this.removeData = function removeData(playerId) {
        for (let i = 0; i < filteredData.length; i++) {
            const data = filteredData[i];
            if (data.id == playerId) {
                debugger
                removedPlayers.push(filteredData[i])
                filteredData.splice([i], 1)
            }
        }
    }

    loadPlayersData(filterData); //call the function above every time we create a new service
}