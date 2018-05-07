function NflController() {
    var nflService = new NflService()

    function drawResults(searchPlay) {
        var template = ''
        for (var i = 0; i < searchPlay.length; i++) {
            var player = searchPlay[i]
            template += `
                    <div class="col-md-5 col-sm-12 card mt-3 mr-3 search-card">
                        <img class='player-img' src="${player.photo}">
                        <h3>Name: ${player.fullname}</h3>
                        <h4>Position: ${player.position}</h4>
                        <h4>Team: ${player.pro_team}</h4>
                        <button class="btn btn-outline-primary mb-2" onclick="app.controller.nflController.addPlayer(${player.id})">Add</button>
                    </div>
            `
        }
        document.getElementById('player-results').innerHTML = template
    }

    function drawTeam(team) {
        var template = ''
        var pos = [team.qb, team.rb1, team.rb2, team.wr1, team.wr2, team.wr3, team.te, team.dst, team.k]
        for (let i = 0; i < pos.length; i++) {
            const player = pos[i];
            if (player.name != '') {
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
        document.getElementById('user-team').innerHTML = template
        document.getElementById('team-display').innerHTML = `
        <p>QB: ${team.qb.name}<br>
            RB: ${team.rb1.name}<br>
            RB: ${team.rb2.name}
        </p>
        <p>WR: ${team.wr1.name}<br>
            WR: ${team.wr2.name}<br>
            WR: ${team.wr3.name}
        </p>
        <p>TE: ${team.te.name}<br>
            DST: ${team.dst.name}<br>
            K: ${team.k.name}
        </p>
        `
    }
    this.search = function search(e) {
        e.preventDefault();
        var searchTerm = e.target.player.value.toUpperCase()
        var teamSearch = nflService.getPlayersByTeam(searchTerm)
        var posSearch = nflService.getPlayersByPosition(searchTerm)
        var nameSearch = nflService.getPlayersByName(searchTerm)
        var teamAndPos = teamSearch.concat(posSearch)
        var resultArr = teamAndPos.concat(nameSearch)
        nflService.searchRecord(resultArr)
        document.getElementById("searchForm").reset();
        drawResults(resultArr)
    }

    this.addPlayer = function addPlayer(id) {
        nflService.addPlayer(id, drawTeam, app.controller.nflController.removePlayer)
        nflService.removeSearch(id, drawResults)
        nflService.removeData(id)
    }
    this.removePlayer = function removePlayer(id) {
        nflService.removePlayer(id, drawTeam)
        nflService.addSearch(id, drawResults)
    }
}


