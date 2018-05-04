function NflService() {
    var playersData = []
    var userTeam = {
        qb: {
            img: '',
            name: '',
            position: '',
            team: ''
        },
        rb: {
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
            }
        },
        wr: {
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
            }
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

    function filterData(arr) {
        debugger
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

    this.addPlayer = function addPlayer(newPlayerId) {
        var newPlayer = filteredData.find(function (player) {
            return player.id == newPlayerId
        })
        if (newPlayer.position == 'QB') {
            userTeam.qb.img = newPlayer.photo
            userTeam.qb.name = newPlayer.fullname
            userTeam.qb.position = newPlayer.position
            userTeam.qb.team = newPlayer.pro_team
        } else if (newPlayer.position == 'RB') {
            if (userTeam.rb.rb1.name == '') {
                userTeam.rb.rb1.img = newPlayer.photo
                userTeam.rb.rb1.name = newPlayer.fullname
                userTeam.rb.rb1.position = newPlayer.position
                userTeam.rb.rb1.team = newPlayer.pro_team
            } else {
                userTeam.rb.rb2.img = newPlayer.photo
                userTeam.rb.rb2.name = newPlayer.fullname
                userTeam.rb.rb2.position = newPlayer.position
                userTeam.rb.rb2.team = newPlayer.pro_team
            }
        } else if (newPlayer.position == 'WR') {
            if (userTeam.wr.wr1.name == '') {
                userTeam.wr.wr1.img = newPlayer.photo
                userTeam.wr.wr1.name = newPlayer.fullname
                userTeam.wr.wr1.position = newPlayer.position
                userTeam.wr.wr1.team = newPlayer.pro_team
            } else if (userTeam.wr.wr2.name == '') {
                userTeam.wr.wr2.img = newPlayer.photo
                userTeam.wr.wr2.name = newPlayer.fullname
                userTeam.wr.wr2.position = newPlayer.position
                userTeam.wr.wr2.team = newPlayer.pro_team
            } else {
                userTeam.wr.wr3.img = newPlayer.photo
                userTeam.wr.wr3.name = newPlayer.fullname
                userTeam.wr.wr3.position = newPlayer.position
                userTeam.wr.wr3.team = newPlayer.pro_team
            }
        } else if (newPlayer.position == 'TE') {
            userTeam.te.img = newPlayer.photo
            userTeam.te.name = newPlayer.fullname
            userTeam.te.position = newPlayer.position
            userTeam.te.team = newPlayer.pro_team
        } else if (newPlayer.position == 'DST') {
            userTeam.dst.img = newPlayer.photo
            userTeam.dst.name = newPlayer.fullname
            userTeam.dst.position = newPlayer.position
            userTeam.dst.team = newPlayer.pro_team
        } else {
            userTeam.k.img = newPlayer.photo
            userTeam.k.name = newPlayer.fullname
            userTeam.k.position = newPlayer.position
            userTeam.k.team = newPlayer.pro_team
        }
        return userTeam
    }

    loadPlayersData(filterData); //call the function above every time we create a new service
}