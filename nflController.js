function NflController() {
    var nflService = new NflService()
    //dynamically draws search results
    function drawResults(searchPlay) {
        var template = ''
        for (var i = 0; i < searchPlay.length; i++) {
            var player = searchPlay[i]
            if (player.id) {
                template += `
                    <div class="col-md-5 col-sm-12 card mt-3 mr-3 search-card">
                        <img class='player-img' src="${player.img}">
                        <h3>Name: ${player.name}</h3>
                        <h4>Position: ${player.position}</h4>
                        <h4>Team: ${player.team}</h4>
                        <button class="btn btn-outline-primary mb-2" onclick="app.controller.nflController.addPlayer(${player.id})">Add</button>
                    </div>
            `
            }
        }
        document.getElementById('player-results').innerHTML = template
    }
    //dynamically draws users team
    function drawTeam(team) {
        var template = ''
        for (let i = 0; i < team.length; i++) {
            const player = team[i];
            if (player.id) {
                template += `
                    <div class="col-10 offset-2 card mt-3 d-flex flex-column team-card">
                        <img class='player-img' src="${player.img}">
                        <h3>Name: ${player.name}</h3>
                        <h4>Position: ${player.position}</h4>
                        <h4>Team: ${player.team}</h4>
                        <button class="btn btn-outline-danger mb-2" onclick="app.controller.nflController.removePlayer(${player.id})">Remove</button>
                    </div>
            `
            }
        }
        var teamObj = {
            RB: {
                RB1: '',
                RB2: ''
            },
            WR: {
                WR1: '',
                WR2: '',
                WR3: ''
            }
        }
        team.forEach(player => {
            if (player.position == 'RB') {
                if (!teamObj.RB['RB1']) {
                    teamObj.RB.RB1 = player.name
                } else {
                    teamObj.RB.RB2 = player.name
                }
            }
            if (player.position == 'WR') {
                if (teamObj.WR['WR1']) {
                    teamObj.WR['WR1'] = player.name
                } else if (teamObj.WR['WR2']) {
                    teamObj.WR['WR2'] = player.name
                } else {
                    teamObj.WR['WR3'] = player.name
                }
            } else if (player.position != 'WR' && player.position != 'RB') {
                teamObj[player.position] = player.name
            }
        });
        console.log(teamObj)
        document.getElementById('user-team').innerHTML = template
        //this makes the header team name thing to the right of the search bar
        document.getElementById('team-display').innerHTML = `
        <p>QB: ${teamObj.QB ? teamObj.QB : 'empty'}<br>
            RB: ${teamObj.RB.RB1 ? teamObj.RB.RB1 : 'empty'}<br>
            RB: ${teamObj.RB.RB2 ? teamObj.RB.RB2 : 'empty'}
        </p>
        <p>WR: ${teamObj.WR.WR1 ? teamObj.WR.WR1 : 'empty'}<br>
            WR: ${teamObj.WR.WR2 ? teamObj.WR.WR2 : 'empty'}<br>
            WR: ${teamObj.WR.WR3 ? teamObj.WR.WR3 : 'empty'}
        </p>
        <p>TE: ${teamObj.TE ? teamObj.TE : 'empty'}<br>
            DST: ${teamObj.DST ? teamObj.DST : 'empty'}<br>
            K: ${teamObj.K ? teamObj.K : 'empty'}
        </p>
        `
    }
    //this finds players on search submit
    this.search = function search(e) {
        e.preventDefault();
        var searchTerm = e.target.player.value.toUpperCase()
        nflService.search(searchTerm, drawResults)
    }

    this.addPlayer = function addPlayer(id) {
        nflService.addPlayer(id, drawTeam)
        //removes player from search results and data
        nflService.removeSearch(drawResults)
    }
    this.removePlayer = function removePlayer(id) {
        if (id != undefined) {
            //tells service to removePlayer from userTeam that has that id
            nflService.addSearch(id, drawResults)
            nflService.removePlayer(id, drawTeam)
            //adds removed player back into search results
        }
    }
}
